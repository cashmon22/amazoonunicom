import type { Request, RequestHandler } from "express";
import type { User } from "@supabase/supabase-js";
import {
  createServiceRoleSupabaseClient,
  supabase,
} from "../lib/supabase";
import type {
  AdminApplication,
  AdminApplicationStatus,
} from "../../shared/admin-applications";

const allowedStatuses: AdminApplicationStatus[] = [
  "Under Review",
  "Approved",
  "Rejected",
];

function stringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function hasEligibility(data: unknown, phrase: string): boolean {
  return stringArray(data).includes(phrase);
}

function applicationStatus(value: unknown): AdminApplicationStatus {
  return allowedStatuses.includes(value as AdminApplicationStatus)
    ? (value as AdminApplicationStatus)
    : "Under Review";
}

function databaseRowToApplication(
  row: Record<string, unknown>,
): AdminApplication {
  const firstName = stringValue(row.first_name);
  const lastName = stringValue(row.last_name);
  const status = applicationStatus(row.status);

  return {
    id: stringValue(row.id),
    applicantName:
      `${firstName} ${lastName}`.trim() || "Unnamed applicant",
    email: stringValue(row.email),
    phone: stringValue(row.phone),
    applicationDate: stringValue(row.created_at),
    status,
    details: {
      firstName,
      lastName,
      email: stringValue(row.email),
      phone: stringValue(row.phone),
      country: stringValue(row.country),
      timeZone: stringValue(row.time_zone),
      interests: stringArray(row.assignment_categories),
      hours: stringValue(row.weekly_hours),
      experience: stringValue(row.previous_experience),
      reason: stringValue(row.motivation),
      eligibility: [
        row.age_18_plus === true ? "I am at least 18 years old." : "",
        row.reliable_internet === true
          ? "I have reliable internet access."
          : "",
        row.follows_instructions === true
          ? "I can follow assignment instructions accurately."
          : "",
        row.agrees_policies === true
          ? "I agree to Contributor Program policies."
          : "",
        row.understands_review === true
          ? "I understand applications are reviewed before approval."
          : "",
      ].filter(Boolean),
    },
  };
}

function getServiceRoleClient(
  res: Parameters<RequestHandler>[1],
) {
  try {
    return createServiceRoleSupabaseClient();
  } catch (error) {
    console.error("Application service configuration error:", error);
    res.status(503).json({ error: "Application data is not configured." });
    return null;
  }
}

async function getAdminUser(
  token: string,
  res: Parameters<RequestHandler>[1],
): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  if (data.user.app_metadata?.role !== "admin") {
    res.status(403).json({ error: "Administrator access required" });
    return null;
  }

  return data.user;
}

async function requireAdmin(
  req: Request,
  res: Parameters<RequestHandler>[1],
) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  const admin = await getAdminUser(token, res);
  if (!admin) return null;

  const serviceSupabase = getServiceRoleClient(res);
  if (!serviceSupabase) return null;
  if (!admin) return null;

  return { admin, serviceSupabase };
}

async function listApplications(
  req: Request,
  res: Parameters<RequestHandler>[1],
  serviceSupabase: ReturnType<typeof createServiceRoleSupabaseClient>,
) {
  const { data, error } = await serviceSupabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load applications from Supabase:", error);
    res.status(500).json({ error: "Unable to load applications." });
    return null;
  }

  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim().toLowerCase()
      : "";
  const status =
    typeof req.query.status === "string" ? req.query.status : "";

  return (data ?? [])
    .map((row) => databaseRowToApplication(row as Record<string, unknown>))
    .filter(
      (application) =>
        (!search ||
          application.applicantName.toLowerCase().includes(search) ||
          application.email.toLowerCase().includes(search)) &&
        (!status || application.status === status),
    );
}

export const mirrorApplication: RequestHandler = async (req, res) => {
  const serviceSupabase = getServiceRoleClient(res);
  if (!serviceSupabase) return;

  try {
    const data = req.body ?? {};
    const eligibility = stringArray(data.eligibility);
    const firstName = stringValue(data.firstName).trim();
    const lastName = stringValue(data.lastName).trim();
    const email = stringValue(data.email).trim();
    const phone = stringValue(data.phone).trim();

    if (!firstName || !lastName || !email || !phone) {
      res.status(400).json({ error: "Required application fields are missing." });
      return;
    }

    const submissionId = stringValue(data.applicationId).trim();
    const application = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      country: stringValue(data.country).trim(),
      time_zone: stringValue(data.timeZone).trim(),
      assignment_categories: stringArray(data.interests).join(", "),
      weekly_hours: stringValue(data.hours).trim(),
      previous_experience: stringValue(data.experience).trim(),
      motivation: stringValue(data.reason).trim(),
      age_18_plus: hasEligibility(
        eligibility,
        "I am at least 18 years old.",
      ),
      reliable_internet: hasEligibility(
        eligibility,
        "I have reliable internet access.",
      ),
      follows_instructions: hasEligibility(
        eligibility,
        "I can follow assignment instructions accurately.",
      ),
      agrees_policies: hasEligibility(
        eligibility,
        "I agree to Contributor Program policies.",
      ),
      understands_review: hasEligibility(
        eligibility,
        "I understand applications are reviewed before approval.",
      ),
      ...(submissionId ? { submission_id: submissionId } : {}),
    };

    const result = submissionId
      ? await serviceSupabase
          .from("applications")
          .upsert(application, {
            onConflict: "submission_id",
            ignoreDuplicates: true,
          })
          .select("id")
      : await serviceSupabase
          .from("applications")
          .insert(application)
          .select("id");

    if (result.error) {
      console.error("Application mirror failed in Supabase:", result.error);
      res.status(500).json({ error: "Unable to save application." });
      return;
    }

    res.status(result.data?.length ? 201 : 200).json({
      success: true,
      duplicate: !result.data?.length,
    });
  } catch (error) {
    console.error("Application mirror error:", error);
    res.status(500).json({ error: "Unable to save application." });
  }
};

export const listAdminApplications: RequestHandler = async (req, res) => {
  const context = await requireAdmin(req, res);
  if (!context) return;

  const applications = await listApplications(req, res, context.serviceSupabase);
  if (!applications) return;

  res.json({
    applications,
    total: applications.length,
  });
};

export const getAdminApplicationDetails: RequestHandler = async (
  req,
  res,
) => {
  const context = await requireAdmin(req, res);
  if (!context) return;

  const { data, error } = await context.serviceSupabase
    .from("applications")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load application details from Supabase:", error);
    res.status(500).json({ error: "Unable to load application details." });
    return;
  }

  if (!data) {
    res.status(404).json({ error: "Application not found." });
    return;
  }

  res.json(databaseRowToApplication(data as Record<string, unknown>));
};

export const updateAdminApplicationStatus: RequestHandler = async (
  req,
  res,
) => {
  const context = await requireAdmin(req, res);
  if (!context) return;

  const status = req.body?.status as AdminApplicationStatus;
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid application status." });
    return;
  }

  const { data, error } = await context.serviceSupabase
    .from("applications")
    .update({ status })
    .eq("id", req.params.id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    console.error("Failed to update application status in Supabase:", error);
    res.status(500).json({ error: "Unable to update application status." });
    return;
  }

  if (!data) {
    res.status(404).json({ error: "Application not found." });
    return;
  }

  res.json(data);
};
