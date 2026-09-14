import { supabase } from "./supabase";

export type AdminDashboardStats = {
  users: number;
  applications: number;
  deviceRequests: number;
  availableDevices: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Your secure session has expired. Please sign in again.");

  const { data, error } = await supabase.functions.invoke<AdminDashboardStats>("swift-endpoint", {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw error;
  if (!data) throw new Error("Unable to load dashboard statistics.");
  return data;
}
