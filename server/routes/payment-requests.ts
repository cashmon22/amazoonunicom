import crypto from "node:crypto";
import type { Request, RequestHandler } from "express";
import type { User } from "@supabase/supabase-js";
import { createAuthenticatedSupabaseClient, supabase } from "../lib/supabase";
import { vendorDevices } from "../../shared/vendor-data";
import type {
  CreatePaymentRequestInput,
  PaymentRequestStatus,
} from "../../shared/payment-requests";

const allowedStatuses: PaymentRequestStatus[] = [
  "Pending Review",
  "Approved",
  "Rejected",
  "Completed",
];

type AuthenticatedRequest = Request & { user?: User };

async function getAuthenticatedUser(
  req: Request,
  res: Parameters<RequestHandler>[1],
) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  return {
    user: data.user,
    supabase: createAuthenticatedSupabaseClient(token),
  };
}

function isAdmin(user: User) {
  return user.app_metadata?.role === "admin";
}

function requireText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export const createPaymentRequest: RequestHandler = async (req, res) => {
  const context = await getAuthenticatedUser(req, res);
  if (!context) return;
  const { user, supabase: authenticatedSupabase } = context;

  const body = req.body as Partial<CreatePaymentRequestInput>;
  if (
    !requireText(body.deviceId) ||
    !requireText(body.fullLegalName) ||
    !requireText(body.phone) ||
    !requireText(body.deliveryAddress) ||
    !requireText(body.city) ||
    !requireText(body.stateProvince) ||
    !requireText(body.postalCode) ||
    !requireText(body.country) ||
    body.confirmation !== true
  ) {
    res.status(400).json({
      error:
        "Complete all required fields and confirm the information provided.",
    });
    return;
  }

  const device = vendorDevices.find((item) => item.id === body.deviceId);
  if (!device) {
    res.status(400).json({ error: "The selected device is not available." });
    return;
  }

  const { data, error } = await authenticatedSupabase
    .from("payment_requests")
    .insert({
      id: crypto.randomUUID(),
      user_id: user.id,
      full_legal_name: body.fullLegalName.trim(),
      email: user.email ?? "",
      phone: body.phone.trim(),
      delivery_address: body.deliveryAddress.trim(),
      city: body.city.trim(),
      state_province: body.stateProvince.trim(),
      postal_code: body.postalCode.trim(),
      country: body.country.trim(),
      device_id: device.id,
      device_name: device.name,
      device_model: device.model,
      device_amount: device.price,
      currency: device.currency,
      vendor: "Trusted Vendor",
      status: "Pending Review",
    })
    .select(
      "id, user_id, full_legal_name, email, phone, delivery_address, city, state_province, postal_code, country, device_id, device_name, device_model, device_amount, currency, vendor, status, created_at",
    )
    .single();

  if (error) {
    res.status(500).json({ error: "Unable to save the payment request." });
    return;
  }

  res.status(201).json({
    id: data.id,
    userId: data.user_id,
    fullLegalName: data.full_legal_name,
    email: data.email,
    phone: data.phone,
    deliveryAddress: data.delivery_address,
    city: data.city,
    stateProvince: data.state_province,
    postalCode: data.postal_code,
    country: data.country,
    deviceId: data.device_id,
    deviceName: data.device_name,
    deviceModel: data.device_model,
    deviceAmount: data.device_amount,
    currency: data.currency,
    vendor: data.vendor,
    status: data.status,
    createdAt: data.created_at,
  });
};

export const listPaymentRequests: RequestHandler = async (req, res) => {
  const context = await getAuthenticatedUser(req, res);
  if (!context) return;
  const { user, supabase: authenticatedSupabase } = context;

  const query = authenticatedSupabase
    .from("payment_requests")
    .select(
      "id, user_id, full_legal_name, email, phone, delivery_address, city, state_province, postal_code, country, device_id, device_name, device_model, device_amount, currency, vendor, status, created_at",
    )
    .order("created_at", { ascending: false });
  const { data, error } = isAdmin(user)
    ? await query
    : await query.eq("user_id", user.id);

  if (error) {
    res.status(500).json({ error: "Unable to load payment requests." });
    return;
  }

  res.json(
    data.map((request) => ({
      id: request.id,
      userId: request.user_id,
      fullLegalName: request.full_legal_name,
      email: request.email,
      phone: request.phone,
      deliveryAddress: request.delivery_address,
      city: request.city,
      stateProvince: request.state_province,
      postalCode: request.postal_code,
      country: request.country,
      deviceId: request.device_id,
      deviceName: request.device_name,
      deviceModel: request.device_model,
      deviceAmount: request.device_amount,
      currency: request.currency,
      vendor: request.vendor,
      status: request.status,
      createdAt: request.created_at,
    })),
  );
};

export const updatePaymentRequestStatus: RequestHandler = async (req, res) => {
  const context = await getAuthenticatedUser(req, res);
  if (!context) return;
  const { user, supabase: authenticatedSupabase } = context;
  if (!isAdmin(user)) {
    res.status(403).json({ error: "Administrator access required" });
    return;
  }

  const status = req.body?.status as PaymentRequestStatus;
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid payment request status" });
    return;
  }

  const { data, error } = await authenticatedSupabase
    .from("payment_requests")
    .update({ status })
    .eq("id", req.params.id)
    .select("id, status")
    .single();

  if (error) {
    res.status(500).json({ error: "Unable to update payment request status." });
    return;
  }

  res.json(data);
};

export type { AuthenticatedRequest };
