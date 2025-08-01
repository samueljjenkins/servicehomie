import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    console.log('Activate subscription API received:', { userId });

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Update the database to set subscription as active with a test subscription ID
    const { error: updateError } = await supabase
      .from('technician_profiles')
      .update({
        subscription_status: 'active',
        stripe_subscription_id: 'sub_test_' + Date.now(), // Generate a test subscription ID
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        monthly_fee: 19,
        updated_at: new Date().toISOString()
      })
      .eq('user_profile_id', userId);

    if (updateError) {
      console.error('Error updating database:', updateError);
      return NextResponse.json(
        { error: 'Failed to activate subscription in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully for testing',
      subscription: {
        status: 'active',
        stripe_subscription_id: 'sub_test_' + Date.now()
      }
    });

  } catch (error) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 