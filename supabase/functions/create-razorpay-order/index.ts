import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Using basic fetch for Razorpay API since there isn't a solid Deno SDK port
// Razorpay API docs: https://razorpay.com/docs/api/orders/#create-an-order

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const { orderId } = await req.json()
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400, headers: corsHeaders })
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabaseAdmin
      .from('Order')
      .select('*')
      .eq('id', orderId)
      .eq('customerId', user.id)
      .single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found or access denied' }), { status: 404, headers: corsHeaders })
    }

    if (order.paymentStatus === 'FULLY_PAID') {
      return new Response(JSON.stringify({ error: 'Order is already fully paid' }), { status: 400, headers: corsHeaders })
    }

    // Check if there is already a PENDING payment for this order
    const { data: existingPayment } = await supabaseAdmin
      .from('Payment')
      .select('*')
      .eq('orderId', order.id)
      .eq('status', 'PENDING')
      .maybeSingle()

    let amountInCents = Math.round(Number(order.advanceAmount) * 100)
    if (amountInCents < 50) amountInCents = 50
    if (amountInCents > 500000) amountInCents = 500000

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay configuration missing')
    }

    const credentials = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    // Create Razorpay Order
    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'INR',
        receipt: `rcpt_${order.orderNumber}`
      })
    })

    if (!rpRes.ok) {
      const errTxt = await rpRes.text()
      throw new Error(`Razorpay API Error: ${errTxt}`)
    }

    const razorpayOrder = await rpRes.json()

    // Store pending payment in our DB
    const { error: paymentError } = await supabaseAdmin
      .from('Payment')
      .insert({
        orderId: order.id,
        amount: order.advanceAmount,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        status: 'PENDING',
        type: 'ADVANCE',
        paymentMethod: 'Razorpay'
      })

    if (paymentError) {
      throw paymentError
    }

    return new Response(JSON.stringify({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId // Safe to send public key ID to frontend
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
