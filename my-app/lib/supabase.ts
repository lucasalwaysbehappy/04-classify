import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Favorite {
  id: string;
  user_id: string;
  poem_slug: string;
  poet_name: string;
  poem_title: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, "id" | "created_at">;
        Update: Partial<Omit<Favorite, "id" | "created_at" | "user_id">>;
      };
    };
  };
}
