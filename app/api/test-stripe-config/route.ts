import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if required environment variables are set
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_SUBSCRIPTION_PRICE_ID',
      'NEXT_PUBLIC_APP_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({ 
        error: `Missing environment variables: ${missingVars.join(', ')}` 
      }, { status: 500 });
    }

    // Test Stripe connection by making a simple API call
    try {
      await stripe.paymentMethods.list({ limit: 1 });
    } catch (error) {
      return NextResponse.json({ 
        error: 'Stripe API connection failed. Please check your API keys.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Stripe configuration is working correctly' 
    });
  } catch (error) {
    console.error('Error testing Stripe configuration:', error);
    return NextResponse.json(
      { error: 'Failed to test Stripe configuration' },
      { status: 500 }
    );
  }
} 