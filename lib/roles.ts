import { supabase } from "./supabase";

export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
} as const;

export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return data.role;
}

export async function isAdmin(userId: string) {
  const role = await getUserRole(userId);

  return role === ROLES.ADMIN;
}

export async function isClient(userId: string) {
  const role = await getUserRole(userId);

  return role === ROLES.CLIENT;
}