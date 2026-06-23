import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: registrations, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ registrations: [] });
    }

    return NextResponse.json({ registrations: registrations || [] });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json({ registrations: [] });
  }
}
