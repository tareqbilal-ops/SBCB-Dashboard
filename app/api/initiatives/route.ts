import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("initiatives")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  // Validate required fields
  const required = [
    "applicant_name",
    "applicant_email",
    "applicant_phone",
    "target_country",
    "proposed_sectors",
    "founding_members",
    "business_plan_summary",
  ];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `الحقل ${field} مطلوب` },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from("initiatives")
    .insert({
      applicant_name: body.applicant_name,
      applicant_email: body.applicant_email,
      applicant_phone: body.applicant_phone,
      target_country: body.target_country,
      proposed_sectors: body.proposed_sectors,
      founding_members: body.founding_members,
      business_plan_summary: body.business_plan_summary,
      attachments: body.attachments || [],
      status: "مقدّم",
      submitted_by: body.submitted_by || "anonymous",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
