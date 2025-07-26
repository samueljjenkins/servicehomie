import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test 1: Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('technician_profiles')
      .select('count')
      .limit(1);

    if (testError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed', 
        details: testError 
      }, { status: 500 });
    }

    // Test 2: Check table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'technician_profiles' });

    if (columnsError) {
      // Fallback: try a simple query to check structure
      const { data: sampleData, error: sampleError } = await supabase
        .from('technician_profiles')
        .select('*')
        .limit(1);

      if (sampleError) {
        return NextResponse.json({ 
          success: false, 
          error: 'Table structure check failed', 
          details: sampleError 
        }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Database connection working',
        tableExists: true,
        sampleData: sampleData
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      tableExists: true,
      columns: columns
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 