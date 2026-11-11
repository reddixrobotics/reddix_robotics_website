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

    // 1. Create or retrieve the secure student login
    let targetUserId = ''
    const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'STUDENT', is_student: true },
    })

    if (createError) {
      // If student already exists, find their ID and update password
      if (createError.message.includes('already registered') || createError.message.includes('already exists') || (createError as any).status === 422) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
        const existing = users?.find((u: any) => u.email.toLowerCase() === email.toLowerCase())
        if (!existing) throw createError
        targetUserId = existing.id
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
          app_metadata: { role: 'STUDENT', is_student: true },
          user_metadata: { role: 'USER' },
        })
      } else {
        throw createError
      }
    } else {
      targetUserId = newAuthUser.user.id
      // Lock role to USER
      await supabaseAdmin.auth.admin.updateUserById(newAuthUser.user.id, { app_metadata: { role: 'STUDENT', is_student: true }, user_metadata: { role: 'STUDENT', is_student: true } })
    }

    // 2. Always create or update enrollment so the student is assigned to the exact requested batch
    const targetBatch = batchName ? String(batchName).trim() : 'Batch 1'
    const { data: existingEnr } = await supabaseAdmin
      .from('Enrollment')
      .select('id')
      .eq('user_id', targetUserId)

    if (existingEnr && existingEnr.length > 0) {
      await supabaseAdmin
        .from('Enrollment')
        .update({
          course_id: courseId || null,
          batch_name: targetBatch,
          status: 'ACTIVE',
        })
        .eq('user_id', targetUserId)
    } else {
      const { error: enrollError } = await supabaseAdmin.from('Enrollment').insert({
        user_id: targetUserId,
        course_id: courseId || null,
        batch_name: targetBatch,
        status: 'ACTIVE',
      })
      if (enrollError) throw enrollError
    }

    return new Response(JSON.stringify({ success: true, userId: targetUserId }), {
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
