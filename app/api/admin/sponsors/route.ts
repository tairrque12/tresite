import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: sponsors, error } = await supabaseAdmin
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ sponsors: [] });
    }

    return NextResponse.json({ sponsors: sponsors || [] });
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return NextResponse.json({ sponsors: [] });
  }
}
