import type { CreatePaymentRequestInput, PaymentRequest, PaymentRequestStatus } from "@shared/payment-requests";
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

export function createPaymentRequest(input: CreatePaymentRequestInput) {
  return request<PaymentRequest>("/api/payment-requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listPaymentRequests() {
  return request<PaymentRequest[]>("/api/payment-requests");
}

export function updatePaymentRequestStatus(id: string, status: PaymentRequestStatus) {
  return request<{ id: string; status: PaymentRequestStatus }>(`/api/admin/payment-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
