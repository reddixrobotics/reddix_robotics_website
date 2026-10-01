import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const { action, orderId, payload } = await req.json()

    // STAGING MODE: MOCKED RESPONSES ONLY
    // "DO NOT: create a real shipment, assign a real AWB, generate a real pickup"

    if (action === 'track') {
      // Mock safe read-only tracking
      return new Response(JSON.stringify({
        tracking_data: {
          track_status: 1,
          shipment_status: 7,
          shipment_track: [{
            current_status: 'Delivered',
            location: 'Destination',
            date: new Date().toISOString()
          }]
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'create_shipment' || action === 'generate_awb' || action === 'request_pickup') {
      // Check admin roles
      const { data: profile } = await supabaseClient
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (!profile || !['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER'].includes(profile.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
      }

      // Mock success for admin actions
      return new Response(JSON.stringify({
        success: true,
        message: `MOCKED ${action} successful. No real Shiprocket transaction performed.`,
        mocked_data: {
          shipment_id: `mock_ship_${Date.now()}`,
          awb_code: `MOCKAWB${Date.now()}`
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
