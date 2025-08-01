import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckoutSession } from '@/lib/stripe-server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerEmail, technicianProfileId } = await request.json();

    if (!customerEmail || !technicianProfileId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Debug: Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY not configured' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
      return NextResponse.json(
        { error: 'STRIPE_SUBSCRIPTION_PRICE_ID not configured' },
        { status: 500 }
      );
    }

    const session = await createSubscriptionCheckoutSession(
      customerEmail,
      technicianProfileId,
      userId
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create subscription: ${errorMessage}` },
      { status: 500 }
    );
  }
} 