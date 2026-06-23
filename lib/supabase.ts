import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is not configured");
  return url;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      getSupabaseUrl(),
      process.env.SUPABASE_ANON_KEY || ""
    );
  }
  return supabaseInstance;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      getSupabaseUrl(),
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
  }
  return supabaseAdminInstance;
}

export const supabaseAdmin = {
  from: (table: string) => {
    const client = getSupabaseAdmin();
    return client.from(table);
  },
};

export interface Registration {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  position: string;
  school_name: string;
  grade: string;
  city: string;
  state: string;
  tshirt_size: string;
  parent_first_name: string;
  parent_last_name: string;
  relationship: string;
  phone_number: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  sms_consent: boolean;
  waiver_accepted: boolean;
  waiver_signature: string;
  waiver_signed_at: string;
  payment_method: string;
  payment_status: string;
  stripe_payment_id: string | null;
}

export interface Sponsor {
  id: string;
  created_at: string;
  business_name: string;
  contact_email: string;
  tier: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  logo_url: string | null;
  stripe_payment_id: string | null;
}

export interface Booking {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  booking_type: string;
  age_range: string;
  skill_level: string;
  positions: string[];
  session_format: string;
  preferred_date: string;
  backup_date: string | null;
  session_goals: string;
  how_heard: string | null;
  sms_consent: boolean;
  status: string;
}
