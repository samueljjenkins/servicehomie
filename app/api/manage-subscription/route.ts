import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = await request.json();

    let finalCustomerId = customerId;

    // If no customerId provided, try to find customer by user's email
    if (!customerId) {
      try {
        // Get user's email from Clerk (you might need to adjust this based on your Clerk setup)
        // For now, we'll require the customerId to be provided
        return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
      } catch (error) {
        return NextResponse.json({ error: 'Unable to find customer information' }, { status: 400 });
      }
    }

    // Create customer portal session
    const session = await createCustomerPortalSession(finalCustomerId);

    if (!session || !session.url) {
      return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes('No such customer')) {
        return NextResponse.json(
          { error: 'Customer not found. Please contact support.' },
          { status: 404 }
        );
      }
      if (error.message.includes('Invalid customer')) {
        return NextResponse.json(
          { error: 'Invalid customer ID. Please contact support.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create customer portal session. Please try again.' },
      { status: 500 }
    );
  }
} 