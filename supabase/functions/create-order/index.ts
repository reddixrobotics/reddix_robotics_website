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

    // Admin client to bypass RLS for secure DB operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { shippingDetails } = await req.json()

    // 1. Fetch Cart
    const { data: cartItems, error: cartError } = await supabaseAdmin
      .from('CartItem')
      .select('productId, quantity, product:Product(id, price, depositPercentage, availability, name)')
      .eq('userId', user.id)

    if (cartError || !cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty or failed to load' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Calculate values securely
    let subtotal = 0;
    let advanceAmount = 0;
    const itemRecords: any[] = [];

    for (const item of cartItems) {
      const product = item.product;
      if (!product || !product.availability) {
        return new Response(JSON.stringify({ error: `Product ${product?.name || item.productId} is unavailable` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const itemPrice = Number(product.price);
      const depositPercentage = Number(product.depositPercentage ?? 50);
      const itemDeposit = itemPrice * (depositPercentage / 100);

      subtotal += itemPrice * item.quantity;
      advanceAmount += itemDeposit * item.quantity;

      itemRecords.push({
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
        depositAmount: itemDeposit,
      });
    }

    const totalAmount = subtotal;
    const remainingAmount = totalAmount - advanceAmount;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 3. Create Order
    // Since Edge Functions don't have standard Prisma transactions, we insert sequentially or use RPC.
    // Sequential insert using Admin client is fine here since it's internal.
    const { data: order, error: orderCreateError } = await supabaseAdmin
      .from('Order')
      .insert({
        orderNumber,
        customerId: user.id,
        subtotal,
        totalAmount,
        advanceAmount,
        remainingAmount,
        status: 'ORDER_PLACED',
        paymentStatus: 'PENDING',
        shippingDetails: shippingDetails || null,
      })
      .select()
      .single()

    if (orderCreateError) {
      throw orderCreateError
    }

    // 4. Create Order Items
    const orderItemsPayload = itemRecords.map(ir => ({
      orderId: order.id,
      productId: ir.productId,
      quantity: ir.quantity,
      price: ir.price
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('OrderItem')
      .insert(orderItemsPayload)

    if (itemsError) {
      // Rollback manually if needed
      await supabaseAdmin.from('Order').delete().eq('id', order.id)
      throw itemsError
    }

    // Return the created order
    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
