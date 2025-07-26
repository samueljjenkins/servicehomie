import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckoutSession } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { technicianProfileId } = await request.json();

    if (!technicianProfileId) {
      return NextResponse.json({ error: 'Technician profile ID is required' }, { status: 400 });
    }

    // Get user email from Clerk
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());

    const customerEmail = user.email_addresses[0]?.email_address;

    if (!customerEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Create checkout session
    const session = await createSubscriptionCheckoutSession(customerEmail, technicianProfileId);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating subscription checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 