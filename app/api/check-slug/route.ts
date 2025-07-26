import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
    }

    if (slug.length < 3 || slug.length > 30) {
      return NextResponse.json({ error: 'Slug must be between 3 and 30 characters' }, { status: 400 });
    }

    // Check if slug is already taken
    const { data, error } = await supabase
      .from('technician_profiles')
      .select('id')
      .eq('url_slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking slug:', error);
      return NextResponse.json({ error: 'Failed to check slug availability' }, { status: 500 });
    }

    const available = !data; // If no data found, slug is available

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    );
  }
} 