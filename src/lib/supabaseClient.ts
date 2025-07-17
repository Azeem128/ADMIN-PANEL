import { createClient } from "@supabase/supabase-js";
// Fallback to any if Database type is not available
import { Database } from "@/types/supabase"; // Will error if file doesn't exist

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in environment variables");
}

export const supabase = createClient<Database | any>(supabaseUrl, supabaseAnonKey);