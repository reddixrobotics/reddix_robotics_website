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

    const body = await req.json()
    const { action, email, password, courseId, batchName, userId, enrollmentId } = body

    // Handle student deletion from database and LMS
    if (action === 'delete') {
      let targetUserId = userId

      if (!targetUserId && enrollmentId) {
        const { data: enr } = await supabaseAdmin
          .from('Enrollment')
          .select('user_id')
          .eq('id', enrollmentId)
          .maybeSingle()
        if (enr?.user_id) targetUserId = enr.user_id
      }

      if (!targetUserId && email) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
        const found = users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
        if (found) targetUserId = found.id
      }

      // Delete from Enrollment table
      if (enrollmentId) {
        await supabaseAdmin.from('Enrollment').delete().eq('id', enrollmentId)
      }

      if (targetUserId) {
        // Safety check: Never delete a SUPER_ADMIN or ADMIN account
        const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
        const targetRole = targetUser?.user?.app_metadata?.role
        if (targetRole !== 'SUPER_ADMIN' && targetRole !== 'ADMIN') {
          await supabaseAdmin.from('Enrollment').delete().eq('user_id', targetUserId)
          await supabaseAdmin.from('User').delete().eq('id', targetUserId)
          await supabaseAdmin.auth.admin.deleteUser(targetUserId)
        }
      }

      return new Response(JSON.stringify({ success: true, message: 'Student and credentials deleted from database' }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

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

    const targetBatch = batchName ? String(batchName).trim() : 'Batch 1'

    if (createError) {
      // If student already exists, find their ID and update password and batch
      if (createError.message.includes('already registered') || createError.message.includes('already exists') || (createError as any).status === 422) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
        const existing = users?.find((u: any) => u.email.toLowerCase() === email.toLowerCase())
        if (!existing) throw createError
        targetUserId = existing.id
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
          app_metadata: { role: 'STUDENT', is_student: true, batch_name: targetBatch },
          user_metadata: { role: 'STUDENT', is_student: true, batch_name: targetBatch },
        })
      } else {
        throw createError
      }
    } else {
      targetUserId = newAuthUser.user.id
      // Set student metadata with assigned batch
      await supabaseAdmin.auth.admin.updateUserById(newAuthUser.user.id, { 
        app_metadata: { role: 'STUDENT', is_student: true, batch_name: targetBatch }, 
        user_metadata: { role: 'STUDENT', is_student: true, batch_name: targetBatch } 
      })
    }
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
