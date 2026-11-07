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
      return new Response(JSON.stringify({ error: 'Forbidden: Requires SUPER_ADMIN' }), {
        status: 403,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Single extraction of request body (avoids duplicate stream read crash in Deno)
    const { action, email, password, role, id } = await req.json()

    if (action === 'create_teacher') {
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email, 
        password, 
        email_confirm: true,
        app_metadata: { role: 'TEACHER' },
        user_metadata: { role: 'TEACHER' }
      });
      if (createError) throw createError;
      
      return new Response(JSON.stringify(newAuthUser), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
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
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    } 
    else if (action === 'create_admin') {
      if (role === 'SUPER_ADMIN') {
        return new Response(JSON.stringify({ error: 'Forbidden: Cannot create another SUPER_ADMIN' }), {
          status: 403,
          headers: { ...cors, 'Content-Type': 'application/json' },
        })
      }
      
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: role || 'ADMIN' },
        user_metadata: { role: role || 'ADMIN' }
      });

      if (createError) {
        if (createError.message.includes('already registered') || createError.message.includes('already exists') || (createError as any).status === 422) {
           const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
           const existingUser = users?.find((u: any) => u.email === email);
           
           if (existingUser) {
             const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
               app_metadata: { role: role || 'ADMIN' },
               user_metadata: { role: role || 'ADMIN' },
               password: password
             });
             if (updateError) throw updateError;
             return new Response(JSON.stringify(updatedUser), {
               status: 200,
               headers: { ...cors, 'Content-Type': 'application/json' },
             })
           }
        }
        
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' },
        })
      }
      
      return new Response(JSON.stringify(newAuthUser), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    } 
    else if (action === 'delete_admin') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'Missing admin user ID' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' },
        })
      }

      const { data: targetAdmin, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(id);
      if (fetchError || !targetAdmin?.user) throw fetchError || new Error("User not found");
      
      if (targetAdmin.user.app_metadata?.role === 'SUPER_ADMIN') {
        return new Response(JSON.stringify({ error: 'Forbidden: Cannot delete a SUPER_ADMIN' }), {
          status: 403,
          headers: { ...cors, 'Content-Type': 'application/json' },
        })
      }
      
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (err: any) {
    const status = err.message.startsWith('Unauthorized') ? 401 : 400;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
