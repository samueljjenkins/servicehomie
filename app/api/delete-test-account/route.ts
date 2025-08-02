import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Deleting test account for user:', userId);

    // 1. Delete from technician_profiles
    const { error: techError } = await supabase
      .from('technician_profiles')
      .delete()
      .eq('user_profile_id', userId);

    if (techError) {
      console.error('Error deleting technician profile:', techError);
    } else {
      console.log('Technician profile deleted');
    }

    // 2. Delete from user_profiles
    const { error: userError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('clerk_user_id', userId);

    if (userError) {
      console.error('Error deleting user profile:', userError);
    } else {
      console.log('User profile deleted');
    }

    // 3. Delete from Clerk (this will be handled by Clerk's dashboard)
    // You'll need to manually delete from Clerk dashboard or use Clerk's API

    return NextResponse.json({
      success: true,
      message: 'Test account deleted from Supabase. Please also delete from Clerk dashboard.',
      userId
    });

  } catch (error) {
    console.error('Error deleting test account:', error);
    return NextResponse.json(
      { error: 'Failed to delete test account' },
      { status: 500 }
    );
  }
} 