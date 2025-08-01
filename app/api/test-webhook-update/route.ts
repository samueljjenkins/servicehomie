import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Test: Attempting to update technician profile for userId:', userId);

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (userError) {
      console.error('Test: Error getting user profile:', userError);
      return NextResponse.json({ 
        error: 'User profile not found',
        userError: userError.message 
      }, { status: 404 });
    }

    console.log('Test: User profile found:', userProfile);

    // Test update technician profile
    const { data: updateData, error: updateError } = await supabase
      .from('technician_profiles')
      .update({
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
        stripe_subscription_id: 'test_subscription_id_' + Date.now(),
        stripe_customer_id: 'test_customer_id_' + Date.now(),
        monthly_fee: 19,
        updated_at: new Date().toISOString()
      })
      .eq('user_profile_id', userProfile.id)
      .select();

    if (updateError) {
      console.error('Test: Error updating technician profile:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update technician profile',
        updateError: updateError.message 
      }, { status: 500 });
    }

    console.log('Test: Successfully updated technician profile:', updateData);

    return NextResponse.json({
      success: true,
      message: 'Database update test successful',
      updatedProfile: updateData
    });

  } catch (error) {
    console.error('Test: Error in test webhook update:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
} 