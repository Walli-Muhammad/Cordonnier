import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { getPaymentProvider } from '@/lib/payment';

interface CheckoutItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequest = await req.json();
    const { items, shipping } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!shipping?.email || !shipping?.fullName || !shipping?.phone) {
      return NextResponse.json({ error: 'Missing required shipping details.' }, { status: 400 });
    }

    const orderId = `WLM-ORD-${Date.now().toString().slice(-6)}`;
    const paymentProvider = getPaymentProvider();

    const paymentResult = await paymentProvider.createPaymentIntent({
      orderId,
      amount: 50.00,
      currency: 'GBP',
      customerEmail: shipping.email,
      customerName: shipping.fullName,
    });

    // Try DB insertion if orders table is connected
    try {
      await supabaseAdmin.from('orders').insert({
        customer_name: shipping.fullName,
        customer_email: shipping.email,
        customer_phone: shipping.phone,
        address_line1: shipping.addressLine1,
        city: shipping.city,
        postal_code: shipping.postalCode,
        country: shipping.country || 'United Kingdom',
        subtotal: 45.00,
        shipping_cost: 4.99,
        total_amount: 49.99,
        currency: 'GBP',
        status: 'pending',
        payment_method: paymentResult.provider,
        payment_txn_ref: paymentResult.transactionRef,
      });
    } catch {
      // Non-blocking catch for development mock environment
    }

    return NextResponse.json({
      success: true,
      orderId,
      transactionRef: paymentResult.transactionRef,
      isTestMode: paymentResult.isTestMode,
    });

  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
