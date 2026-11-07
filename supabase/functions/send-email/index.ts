import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = [
  'https://reddixrobotics.com',
  'https://www.reddixrobotics.com',
  'http://localhost:5173',
  'http://localhost:3000',
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? ''
  const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://reddixrobotics.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AUTHORIZED_INTERNAL_EMAILS = [
  'admin@reddixrobotics.com',
  'reddixrobotics@gmail.com',
  'info@reddixrobotics.com',
]

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

    // Authenticate the caller
    const { data: { user } } = await supabaseClient.auth.getUser()
    const callerRole = user?.app_metadata?.role as string | undefined
    const isAdmin = callerRole === 'SUPER_ADMIN' || callerRole === 'ADMIN'

    const { to, subject, html, text } = await req.json()

    if (!to || !subject) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, subject' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    if (!EMAIL_REGEX.test(to)) {
      return new Response(JSON.stringify({ error: 'Invalid recipient email format' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Security Hardening: Anti-Open-Relay Gate
    // If not an authenticated admin, only permit legitimate public form targets:
    // 1. Inquiries directed to internal Reddix addresses
    // 2. Automated application confirmation receipts
    if (!isAdmin) {
      const isInternalStaffTarget = AUTHORIZED_INTERNAL_EMAILS.includes(to.toLowerCase())
      const isApplicationReceipt = subject.startsWith('Application Received: Reddix Robotics')

      if (!isInternalStaffTarget && !isApplicationReceipt) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: Unauthenticated custom email relay is disabled for security.' }),
          { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } }
        )
      }
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      // Safe development/test mock
      console.log('Test Mode / Mock Email Sent:', { to, subject })
      return new Response(JSON.stringify({ success: true, message: 'Mock email sent successfully' }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Reddix Robotics <noreply@reddixrobotics.com>',
        to,
        subject,
        html: html || text,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Email provider error: ${err}`)
    }

    const data = await res.json()
    return new Response(JSON.stringify({ success: true, id: data.id }), {
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
