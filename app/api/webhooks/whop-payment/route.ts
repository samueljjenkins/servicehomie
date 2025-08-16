import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook for debugging
    console.log('Whop webhook received:', body);
    
    // Verify this is a payment success webhook
    if (body.event !== 'payment.success') {
      return NextResponse.json({ received: true });
    }

    const { metadata, customer } = body.data;
    
    // Only process service bookings
    if (metadata?.type !== 'service_booking') {
      return NextResponse.json({ received: true });
    }

    // For now, just log the successful payment
    // TODO: Integrate with Supabase when environment is ready
    console.log('Payment successful for booking:', {
      tenantId: metadata.tenantId,
      serviceId: metadata.serviceId,
      customerEmail: metadata.customerEmail,
      amount: metadata.servicePrice
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
