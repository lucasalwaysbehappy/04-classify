import { supabase } from "@/lib/supabase";

export interface Favorite {
  id: string;
  user_id: string;
  poem_slug: string;
  poet_name: string;
  poem_title: string;
  created_at: string;
}

// Get all favorites for a user
export async function getFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data || [];
}

// Add a favorite
export async function addFavorite(
  userId: string,
  poemSlug: string,
  poetName: string,
  poemTitle: string
): Promise<Favorite | null> {
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      poem_slug: poemSlug,
      poet_name: poetName,
      poem_title: poemTitle,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding favorite:", error);
    return null;
  }

  return data;
}

// Remove a favorite
export async function removeFavorite(
  userId: string,
  poemSlug: string
): Promise<boolean> {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("poem_slug", poemSlug);

  if (error) {
    console.error("Error removing favorite:", error);
    return false;
  }

  return true;
}

// Check if a poem is favorited
export async function isFavorited(
  userId: string,
  poemSlug: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("poem_slug", poemSlug)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}
