import { createHash } from "node:crypto";
import type { Request, RequestHandler } from "express";
import {
  supabase,
  createServiceRoleSupabaseClient,
} from "../lib/supabase";
import type { AdminApplication, AdminApplicationStatus } from "../../shared/admin-applications";

const allowedStatuses: AdminApplicationStatus[] = ["Under Review", "Approved", "Rejected"];
const FORMSPREE_FORM_ID = "mvkodbjw";
const FORMSPREE_SUBMISSIONS_URL = `https://formspree.io/api/0/forms/${FORMSPREE_FORM_ID}/submissions`;
const FORMSPREE_PAGE_SIZE = 100;
const FORMSPREE_MAX_SUBMISSIONS = 10_000;

type FormspreeSubmission = Record<string, unknown>;
type FormspreeResponse = { submissions?: unknown };

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

function getFormspreeApiKey() {
  const apiKey = process.env.FORMSPREE_API_KEY?.trim();
  if (!apiKey) throw new Error("FORMSPREE_API_KEY is not configured");
  return apiKey;
}

async function listFormspreeSubmissions() {
  const apiKey = getFormspreeApiKey();
  const submissions: FormspreeSubmission[] = [];

  for (let offset = 0; offset < FORMSPREE_MAX_SUBMISSIONS; offset += FORMSPREE_PAGE_SIZE) {
    const url = new URL(FORMSPREE_SUBMISSIONS_URL);
    url.searchParams.set("limit", String(FORMSPREE_PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("order", "desc");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`:${apiKey}`).toString("base64")}`,
      },
    });

    if (!response.ok) throw new Error(`Formspree returned HTTP ${response.status}`);

    const payload = (await response.json()) as FormspreeResponse;
    const page = Array.isArray(payload.submissions)
      ? payload.submissions.filter(
          (submission): submission is FormspreeSubmission =>
            typeof submission === "object" && submission !== null,
        )
      : [];

    submissions.push(...page);
    if (page.length < FORMSPREE_PAGE_SIZE) break;
  }

  return submissions;
}

function stringValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function submissionId(submission: FormspreeSubmission) {
  const explicitId = stringValue(submission.id || submission._id || submission.submission_id);
  if (explicitId) return explicitId;
  return createHash("sha256")
    .update(JSON.stringify(submission))
    .digest("hex")
    .slice(0, 32);
}

function submissionDate(submission: FormspreeSubmission) {
  return stringValue(submission.submittedAt || submission._date || submission.date);
}

function submissionToApplication(submission: FormspreeSubmission): AdminApplication {
  const firstName = stringValue(submission.firstName);
  const lastName = stringValue(submission.lastName);
  const email = stringValue(submission.email);

  return {
    id: submissionId(submission),
    applicantName: `${firstName} ${lastName}`.trim() || "Unnamed applicant",
    email,
    phone: stringValue(submission.phone),
    applicationDate: submissionDate(submission),
    status: "Under Review",
    details: {
      firstName,
      lastName,
      email,
      phone: stringValue(submission.phone),
      country: stringValue(submission.country),
      timeZone: stringValue(submission.timeZone),
      interests: submission.interests ?? [],
      hours: stringValue(submission.hours),
      experience: stringValue(submission.experience),
      reason: stringValue(submission.reason),
      eligibility: submission.eligibility ?? [],
    },
  };
}

async function listApplications(
  req: Request,
  res: Parameters<RequestHandler>[1],
) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load applications:", error);
    res.status(500).json({ error: "Unable to load applications." });
    return null;
  }

  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim().toLowerCase()
      : "";

  const status =
    typeof req.query.status === "string" ? req.query.status : "";

  const applications: AdminApplication[] = data
    .map((item) => ({
      id: item.id,
      applicantName: `${item.first_name} ${item.last_name}`.trim(),
      email: item.email,
      phone: item.phone,
      applicationDate: item.created_at,
      status: "Under Review" as AdminApplicationStatus,
      details: {
        firstName: item.first_name,
        lastName: item.last_name,
        email: item.email,
        phone: item.phone,
        country: item.country,
        timeZone: item.time_zone,
        interests: item.assignment_categories
          ? item.assignment_categories.split(", ")
          : [],
        hours: item.weekly_hours,
        experience: item.previous_experience,
        reason: item.motivation,
        eligibility: [],
      },
    }))
    .filter(
      (application) =>
        (!search ||
          application.applicantName.toLowerCase().includes(search) ||
          application.email.toLowerCase().includes(search)) &&
        (!status || application.status === status),
    );

  return applications;
}
  let submissions: FormspreeSubmission[];
  try {
    submissions = await listFormspreeSubmissions();
  } catch {
    res.status(process.env.FORMSPREE_API_KEY ? 502 : 503).json({
      error: process.env.FORMSPREE_API_KEY
        ? "Unable to load Formspree applications."
        : "Formspree admin data is not configured.",
    });
    return null;
  }

  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";
  const applications = submissions
    .map(submissionToApplication)
    .filter((application) =>
      (!search ||
        application.applicantName.toLowerCase().includes(search) ||
        application.email.toLowerCase().includes(search)) &&
      (!status || application.status === status),
    );

  return applications;
}

export const mirrorApplication: RequestHandler = async (req, res) => {
  try {
    const data = req.body ?? {};

    const { error } = await supabase.from("applications").insert({
      first_name: String(data.firstName ?? ""),
      last_name: String(data.lastName ?? ""),
      email: String(data.email ?? ""),
      phone: String(data.phone ?? ""),
      country: String(data.country ?? ""),
      time_zone: String(data.timeZone ?? ""),
      assignment_categories: Array.isArray(data.interests)
        ? data.interests.join(", ")
        : String(data.interests ?? ""),
      weekly_hours: String(data.hours ?? ""),
      previous_experience: String(data.experience ?? ""),
      motivation: String(data.reason ?? ""),
      age_18_plus: Array.isArray(data.eligibility)
        ? data.eligibility.includes("I am at least 18 years old.")
        : false,
      reliable_internet: Array.isArray(data.eligibility)
        ? data.eligibility.includes("I have reliable internet access.")
        : false,
      follows_instructions: Array.isArray(data.eligibility)
        ? data.eligibility.includes("I can follow assignment instructions accurately.")
        : false,
      agrees_policies: Array.isArray(data.eligibility)
        ? data.eligibility.includes("I agree to Contributor Program policies.")
        : false,
      understands_review: Array.isArray(data.eligibility)
        ? data.eligibility.includes(
            "I understand applications are reviewed before approval.",
          )
        : false,
    });

    if (error) {
      console.error("Application mirror failed:", error);
      res.status(500).json({ error: "Unable to save application." });
      return;
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Application mirror error:", error);
    res.status(500).json({ error: "Unable to save application." });
  }
};

export const listAdminApplications: RequestHandler = async (req, res) => {
  if (!(await getAdminUser(req, res))) return;
  const applications = await listApplications(req, res);
  if (!applications) return;
  res.json({ applications, total: applications.length });
};

export const getAdminApplicationDetails: RequestHandler = async (req, res) => {
  if (!(await getAdminUser(req, res))) return;
  const applications = await listApplications(req, res);
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
  const status = req.body?.status as AdminApplicationStatus;
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid application status." });
    return;
  }
  res.status(409).json({ error: "Formspree applications are read-only." });
};
