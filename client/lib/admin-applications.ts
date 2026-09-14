import type { AdminApplication, AdminApplicationStatus, AdminApplicationsResponse } from "@shared/admin-applications";
import { supabase } from "./supabase";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Your secure session has expired. Please sign in again.");

  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => null) as { error?: string } | T | null;
  if (!response.ok) {
    throw new Error(payload && typeof payload === "object" && "error" in payload ? payload.error : "Unable to complete the request.");
  }
  return payload as T;
}

export function listAdminApplications(search: string, status: AdminApplicationStatus | "") {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);
  const query = params.toString();
  return request<AdminApplicationsResponse>(`/api/admin/applications${query ? `?${query}` : ""}`);
}

export function getAdminApplicationDetails(id: string) {
  return request<AdminApplication>(`/api/admin/applications/${encodeURIComponent(id)}`);
}

export function updateAdminApplicationStatus(id: string, status: AdminApplicationStatus) {
  return request<{ id: string; status: AdminApplicationStatus }>(`/api/admin/applications/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
