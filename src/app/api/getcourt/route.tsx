import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from 'next/server'

// 
export async function POST(request: NextRequest): Promise<Response> {
  const supabase = createClient();
  const { facility_id } = await request.json();

  let { data, error } = await supabase
    .from('Court')
    .select('*')
    .eq('fk_facility_id', facility_id)

  if (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }

  return new NextResponse(JSON.stringify(data), { status: 200 });
}