import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? ''
  const allowedOrigins = [
    'https://reddixrobotics.com',
    'https://www.reddixrobotics.com',
    'http://localhost:5173',
    'http://localhost:3000',
  ]
  const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://reddixrobotics.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

async function verifyHmac(key: string, data: string, signature: string) {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  // Convert hex signature to Uint8Array
  const sigBytes = new Uint8Array(Math.ceil(signature.length / 2))
  for (let i = 0; i < sigBytes.length; i++) {
    sigBytes[i] = parseInt(signature.substr(i * 2, 2), 16)
  }

  return await crypto.subtle.verify('HMAC', cryptoKey, sigBytes, encoder.encode(data))
}

serve(async (req) => {
  const cors = getCorsHeaders(req)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: 'Missing required payment verification fields' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!secret) throw new Error('Razorpay secret not configured')

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const isValid = await verifyHmac(secret, body, razorpay_signature)

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Valid signature, check payment in DB
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('Payment')
      .select('*, order:Order(customerId)')
      .eq('razorpayOrderId', razorpay_order_id)
      .single()

    if (paymentError || !payment) {
      return new Response(JSON.stringify({ error: 'Payment record not found' }), {
        status: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Verify order belongs to the authenticated user
    if (payment.order?.customerId !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized order access' }), {
        status: 403,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Idempotency: If already success, return immediately
    if (payment.status === 'SUCCESS') {
      return new Response(JSON.stringify({ success: true, message: 'Already verified' }), {
        headers: { ...cors, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Update payment and order status securely
    const { error: updatePaymentError } = await supabaseAdmin
      .from('Payment')
      .update({ status: 'SUCCESS', razorpayPaymentId: razorpay_payment_id })
      .eq('id', payment.id)

    if (updatePaymentError) throw updatePaymentError

    const { error: updateOrderError } = await supabaseAdmin
      .from('Order')
      .update({ paymentStatus: 'PARTIALLY_PAID', status: 'ORDER_CONFIRMED' })
      .eq('id', payment.orderId)

    if (updateOrderError) throw updateOrderError

    return new Response(JSON.stringify({ success: true, message: 'Payment verified successfully' }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
