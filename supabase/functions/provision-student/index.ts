import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

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
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
    }

    const { email, password, courseId } = await req.json()

    // Create the secure student login
    const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true, user_metadata: { role: 'USER' }
    })
    if (createError) throw createError

    // Lock role to USER
    await supabaseAdmin.auth.admin.updateUserById(newAuthUser.user.id, { app_metadata: { role: 'USER' } })

    // Enroll in course
    if (courseId) {
      const { error: enrollError } = await supabaseAdmin.from('Enrollment').insert({
        user_id: newAuthUser.user.id, course_id: courseId, status: 'ACTIVE'
      })
      if (enrollError) throw enrollError
    }

    return new Response(JSON.stringify({ success: true, user: newAuthUser.user }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
