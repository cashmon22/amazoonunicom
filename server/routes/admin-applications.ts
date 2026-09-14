import type { Request, RequestHandler } from "express";
import { createServiceRoleSupabaseClient, supabase } from "../lib/supabase";
import type { AdminApplication, AdminApplicationStatus } from "../../shared/admin-applications";

const allowedStatuses: AdminApplicationStatus[] = ["Under Review", "Approved", "Rejected"];
const applicationFields = ["firstName", "lastName", "email", "phone", "country", "timeZone", "interests", "hours", "experience", "reason", "eligibility"] as const;

type ApplicationInput = Record<string, unknown> & { applicationId?: unknown; submittedAt?: unknown };

type ApplicationRow = {
  application_id: string;
  submission_date: string;
  review_status: AdminApplicationStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  time_zone: string;
  interests: unknown;
  hours: string;
  experience: string;
  reason: string;
  eligibility: unknown;
};

async function getAdminUser(req: Request, res: Parameters<RequestHandler>[1]) {
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
  if (data.user.app_metadata?.role !== "admin") {
    res.status(403).json({ error: "Administrator access required" });
    return null;
  }
  return data.user;
}

function serviceClient(res: Parameters<RequestHandler>[1]) {
  try {
    return createServiceRoleSupabaseClient();
  } catch {
    res.status(503).json({ error: "Admin application data is not configured." });
    return null;
  }
}

function rowToApplication(row: ApplicationRow): AdminApplication {
  const details = {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    timeZone: row.time_zone,
    interests: row.interests,
    hours: row.hours,
    experience: row.experience,
    reason: row.reason,
    eligibility: row.eligibility,
  };
  return {
    id: row.application_id,
    applicantName: `${row.first_name} ${row.last_name}`.trim() || "Unnamed applicant",
    email: row.email,
    phone: row.phone,
    applicationDate: row.submission_date,
    status: row.review_status,
    details,
  };
}

export const mirrorApplication: RequestHandler = async (req, res) => {
  const body = req.body as ApplicationInput;
  const applicationId = typeof body.applicationId === "string" && body.applicationId.trim() ? body.applicationId.trim() : crypto.randomUUID();
  const submittedAt = typeof body.submittedAt === "string" && !Number.isNaN(Date.parse(body.submittedAt)) ? body.submittedAt : new Date().toISOString();
  const values = Object.fromEntries(applicationFields.map((field) => [field, body[field]]));

  const serviceSupabase = serviceClient(res);
  if (!serviceSupabase) return;
  const { error } = await serviceSupabase.from("applications").upsert({
    application_id: applicationId,
    submission_date: submittedAt,
    review_status: "Under Review",
    first_name: values.firstName ?? "",
    last_name: values.lastName ?? "",
    email: values.email ?? "",
    phone: values.phone ?? "",
    country: values.country ?? "",
    time_zone: values.timeZone ?? "",
    interests: values.interests ?? [],
    hours: values.hours ?? "",
    experience: values.experience ?? "",
    reason: values.reason ?? "",
    eligibility: values.eligibility ?? [],
  }, { onConflict: "application_id", ignoreDuplicates: true });

  if (error) {
    res.status(500).json({ error: "Unable to save the application copy." });
    return;
  }
  res.status(201).json({ id: applicationId });
};

async function listRows(req: Request, res: Parameters<RequestHandler>[1]) {
  const serviceSupabase = serviceClient(res);
  if (!serviceSupabase) return null;
  const { data, error } = await serviceSupabase.from("applications").select("application_id, submission_date, review_status, first_name, last_name, email, phone, country, time_zone, interests, hours, experience, reason, eligibility").order("submission_date", { ascending: false });
  if (error) {
    res.status(500).json({ error: "Unable to load applications." });
    return null;
  }

  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";
  return (data as ApplicationRow[]).map(rowToApplication).filter((application) =>
    (!search || application.applicantName.toLowerCase().includes(search) || application.email.toLowerCase().includes(search)) &&
    (!status || application.status === status),
  );
}

export const listAdminApplications: RequestHandler = async (req, res) => {
  if (!(await getAdminUser(req, res))) return;
  const applications = await listRows(req, res);
  if (!applications) return;
  res.json({ applications, total: applications.length });
};

export const getAdminApplicationDetails: RequestHandler = async (req, res) => {
  if (!(await getAdminUser(req, res))) return;
  const applications = await listRows(req, res);
  if (!applications) return;
  const application = applications.find((item) => item.id === req.params.id);
  if (!application) {
    res.status(404).json({ error: "Application not found." });
    return;
  }
  res.json(application);
};

export const updateAdminApplicationStatus: RequestHandler = async (req, res) => {
  if (!(await getAdminUser(req, res))) return;
  const serviceSupabase = serviceClient(res);
  if (!serviceSupabase) return;
  const status = req.body?.status as AdminApplicationStatus;
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid application status." });
    return;
  }
  const { error } = await serviceSupabase.from("applications").update({ review_status: status }).eq("application_id", req.params.id);
  if (error) {
    res.status(500).json({ error: "Unable to update application status." });
    return;
  }
  res.json({ id: req.params.id, status });
};
