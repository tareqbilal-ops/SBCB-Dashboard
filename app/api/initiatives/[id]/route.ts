import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("initiatives")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const updateData: Record<string, unknown> = {};

  // Allow updating status and reviewer notes
  if (body.status) updateData.status = body.status;
  if (body.reviewer_notes !== undefined) updateData.reviewer_notes = body.reviewer_notes;
  if (body.status && body.status !== "مقدّم") {
    updateData.reviewed_at = new Date().toISOString();
  }
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("initiatives")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
