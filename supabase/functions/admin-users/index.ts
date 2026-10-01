import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Unauthorized')
    const token = authHeader.replace('Bearer ', '')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the caller's JWT safely using the auth service
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) throw new Error('Unauthorized: Invalid token')

    // Verify role claim
    if (user.app_metadata?.role !== 'SUPER_ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden: Requires SUPER_ADMIN' }), { status: 403, headers: corsHeaders })
    }

    const { action, email, password, role } = await req.json()

    if (action === 'create_admin') {
      if (role === 'SUPER_ADMIN') {
        return new Response(JSON.stringify({ error: 'Forbidden: Cannot create another SUPER_ADMIN' }), { status: 403, headers: corsHeaders })
      }

      const passwordHash = await bcrypt.hash(password);
      
      const { data, error } = await supabaseAdmin.from('Admin').insert({
        email,
        passwordHash,
        role: role || 'ADMIN'
      }).select().single();

      if (error) throw error;

      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    } else if (action === 'delete_admin') {
      const { id } = await req.json()
      
      // Prevent deleting self or SUPER_ADMIN
      const { data: targetAdmin } = await supabaseAdmin.from('Admin').select('*').eq('id', id).single()
      if (targetAdmin?.role === 'SUPER_ADMIN') {
        return new Response(JSON.stringify({ error: 'Forbidden: Cannot delete a SUPER_ADMIN' }), { status: 403, headers: corsHeaders })
      }

      const { error } = await supabaseAdmin.from('Admin').delete().eq('id', id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    throw new Error('Invalid action')
  } catch (err: any) {
    const status = err.message.startsWith('Unauthorized') ? 401 : 400;
    return new Response(JSON.stringify({ error: err.message }), { status, headers: corsHeaders })
  }
})
