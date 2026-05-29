import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

let supabaseInstance: any = null;

/**
 * Returns the Supabase client if configured, otherwise null.
 */
export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error("Erro ao instanciar Supabase:", e);
    }
  }
  return supabaseInstance;
}

/**
 * Interface representing a real system user retrieved via Supabase tables or system state databases
 */
export interface RealUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  bio?: string;
  isVerified?: boolean;
}

/**
 * Performs a search query against Supabase 'profiles' or 'users' tables
 * If supabase is not configured or fails, it falls back to querying the application's real user registry.
 */
export async function searchRealUsers(
  query: string,
  localUsersFallback: RealUser[]
): Promise<RealUser[]> {
  const cleanQuery = query.toLowerCase().trim().replace("@", "");
  if (!cleanQuery) return [];

  const supabase = getSupabase();
  if (supabase) {
    try {
      console.log(`[Supabase] Buscando usuário pelo termo: "${cleanQuery}"`);
      // We attempt to fetch profiles matching username or display_name
      // Fits any schema layout (profiles, users, etc.)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, id_alias, username, display_name, displayName, avatar, avatar_url, is_online, isOnline, bio, is_verified, isVerified")
        .or(`username.ilike.%${cleanQuery}%,displayName.ilike.%${cleanQuery}%,display_name.ilike.%${cleanQuery}%`)
        .limit(10);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id || item.id_alias || `sb_${Math.random().toString(36).substring(7)}`,
          username: item.username || "usuario_sb",
          displayName: item.displayName || item.display_name || item.username || "Usuário Supabase",
          avatar: item.avatar || item.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          isOnline: item.isOnline || item.is_online || false,
          bio: item.bio || "",
          isVerified: item.isVerified || item.is_verified || false,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Falha ao consultar banco remoto. Usando banco síncrono local da Aura.", err);
    }
  }

  // Fallback to searching the real local user directory
  console.log("[Supabase Local Hub] Buscando no banco geral de usuários ativos.");
  return localUsersFallback.filter(
    (u) =>
      u.username.toLowerCase().includes(cleanQuery) ||
      u.displayName.toLowerCase().includes(cleanQuery)
  );
}
