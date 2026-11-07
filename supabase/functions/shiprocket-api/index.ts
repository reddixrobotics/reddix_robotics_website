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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const { action } = await req.json()

    // STAGING MODE: MOCKED RESPONSES ONLY
    if (action === 'track') {
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
      }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create_shipment' || action === 'generate_awb' || action === 'request_pickup') {
      const { data: profile } = await supabaseClient
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single()
        
      if (!profile || !['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER'].includes(profile.role)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...cors, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: `MOCKED ${action} successful. No real Shiprocket transaction performed.`,
        mocked_data: {
          shipment_id: `mock_ship_${Date.now()}`,
          awb_code: `MOCKAWB${Date.now()}`
        }
      }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
