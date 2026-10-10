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

    if (action === 'create_teacher') {
      // Direct explicit creation of user with a generated password
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email, 
        password, 
        email_confirm: true,
        app_metadata: { role: 'TEACHER' },
        user_metadata: { role: 'TEACHER' }
      });
      if (createError) throw createError;
      
      return new Response(JSON.stringify(newAuthUser), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    else if (action === 'invite_teacher') {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { role: 'TEACHER' }
      });
      if (error) throw error;
      
      if (data.user) {
         await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
           app_metadata: { role: 'TEACHER' }
         });
      }
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    } 
    else if (action === 'create_admin') {
      if (role === 'SUPER_ADMIN') {
        return new Response(JSON.stringify({ error: 'Forbidden: Cannot create another SUPER_ADMIN' }), { status: 403, headers: corsHeaders })
      }
      
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: role || 'ADMIN' },
        user_metadata: { role: role || 'ADMIN' }
      });

      if (createError) {
        // If the user already exists, let's just update their role!
        if (createError.message.includes('already registered') || createError.message.includes('already exists') || createError.status === 422) {
           // We need to find the user ID first
           const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
           const existingUser = users.find((u: any) => u.email === email);
           
           if (existingUser) {
             const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
               app_metadata: { role: role || 'ADMIN' },
               user_metadata: { role: role || 'ADMIN' },
               password: password // update password to the new temp password
             });
             if (updateError) throw updateError;
             return new Response(JSON.stringify(updatedUser), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
           }
        }
        
        // If it's some other error, return the specific message so the frontend can show it
        return new Response(JSON.stringify({ error: createError.message }), { status: 400, headers: corsHeaders })
      }
      
      return new Response(JSON.stringify(newAuthUser), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    } 
    else if (action === 'delete_admin') {
      const { id } = await req.json()
      
      const { data: targetAdmin, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(id);
      if (fetchError || !targetAdmin.user) throw fetchError || new Error("User not found");
      
      if (targetAdmin.user.app_metadata?.role === 'SUPER_ADMIN') {
        return new Response(JSON.stringify({ error: 'Forbidden: Cannot delete a SUPER_ADMIN' }), { status: 403, headers: corsHeaders })
      }
      
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    throw new Error('Invalid action')
  } catch (err: any) {
    const status = err.message.startsWith('Unauthorized') ? 401 : 400;
    return new Response(JSON.stringify({ error: err.message }), { status, headers: corsHeaders })
  }
})
