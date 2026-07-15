import { supabase } from "./supabase";
import { ROLES } from "./roles";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;

  return data;
}

export async function requireAdmin() {
  const profile = await getProfile();

  if (!profile) {
    return {
      allowed: false,
      profile: null,
    };
  }

  return {
    allowed: profile.role === ROLES.ADMIN,
    profile,
  };
}

export async function requireClient() {
  const profile = await getProfile();

  if (!profile) {
    return {
      allowed: false,
      profile: null,
    };
  }

  return {
    allowed: profile.role === ROLES.CLIENT,
    profile,
  };
}

export async function logout() {
  await supabase.auth.signOut();
}