import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing',
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'N/A',
      stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing',
      stripePublishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) || 'N/A',
      subscriptionPriceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID ? '✅ Set' : '❌ Missing',
      subscriptionPriceIdValue: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || 'N/A',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ? '✅ Set' : '❌ Missing',
      siteUrlValue: process.env.NEXT_PUBLIC_SITE_URL || 'N/A',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing',
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
} 