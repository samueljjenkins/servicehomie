import { NextRequest, NextResponse } from 'next/server';

// Conditional import to avoid build-time errors
let supabase: any = null;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
} catch (error) {
  console.warn('Supabase not available:', error);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  try {
    const { tenant } = await params;

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Check if Supabase environment variables are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase environment variables not configured, returning mock data');
      return NextResponse.json({
        id: 'mock-tenant-id',
        whop_company_id: tenant,
        name: 'Demo Business',
        description: 'Demo business for testing',
        logo_url: null,
        whop_plan_id: process.env.NEXT_PUBLIC_WHOP_PLAN_ID || 'plan_demo123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Get tenant data by whop_company_id
    const { data: tenantData, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('whop_company_id', tenant)
      .single();

    if (error) {
      console.error('Error fetching tenant:', error);
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tenantData);

  } catch (error) {
    console.error('Error in tenant API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
