import type { AdminUser, AdminUsersResponse, AdminUserStatus } from "@shared/admin-users";
import { supabase } from "./supabase";

async function invokeUsers<T>(body: Record<string, string>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Your secure session has expired. Please sign in again.");

  const { data, error } = await supabase.functions.invoke<T>("admin-users", {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw error;
  if (!data) throw new Error("Unable to complete the request.");
  return data;
}

export function listAdminUsers(search: string) {
  return invokeUsers<AdminUsersResponse>({ action: "list", search });
}

export function getAdminUserDetails(id: string) {
  return invokeUsers<AdminUser>({ action: "details", id });
}

export function updateAdminUserStatus(id: string, status: AdminUserStatus) {
  return invokeUsers<AdminUser>({ action: "update-status", id, status });
}
