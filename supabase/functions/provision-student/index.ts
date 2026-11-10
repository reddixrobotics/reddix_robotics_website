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

serve(async (req) => {
  const cors = getCorsHeaders(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')
    const token = authHeader.replace('Bearer ', '')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) throw new Error('Unauthorized')

    const role = user.app_metadata?.role
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden: Requires ADMIN privileges' }), {
        status: 403,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const { email, password, courseId, batchName } = await req.json()
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required credentials: email, password' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Create the secure student login
    const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'USER' },
    })
    if (createError) throw createError

    // Lock role to USER
    await supabaseAdmin.auth.admin.updateUserById(newAuthUser.user.id, { app_metadata: { role: 'USER' } })

    // Enroll in course with batch tag
    if (courseId) {
      const { error: enrollError } = await supabaseAdmin.from('Enrollment').insert({
        user_id: newAuthUser.user.id,
        course_id: courseId,
        batch_name: batchName ? String(batchName).trim() : 'Batch 1',
        status: 'ACTIVE',
      })
      if (enrollError) throw enrollError
    }

    return new Response(JSON.stringify({ success: true, user: newAuthUser.user }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
