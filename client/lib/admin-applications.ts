import type { AdminApplication, AdminApplicationStatus, AdminApplicationsResponse } from "@shared/admin-applications";
import { supabase } from "./supabase";

const allowedStatuses: AdminApplicationStatus[] = ["Under Review", "Approved", "Rejected"];

function stringValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function rowToApplication(row: Record<string, unknown>): AdminApplication {
  const firstName = stringValue(row.first_name);
  const lastName = stringValue(row.last_name);
  const status = allowedStatuses.includes(row.status as AdminApplicationStatus)
    ? row.status as AdminApplicationStatus
    : "Under Review";

  return {
    id: stringValue(row.id),
    applicantName: `${firstName} ${lastName}`.trim() || "Unnamed applicant",
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
        row.reliable_internet === true ? "I have reliable internet access." : "",
        row.follows_instructions === true ? "I can follow assignment instructions accurately." : "",
        row.agrees_policies === true ? "I agree to Contributor Program policies." : "",
        row.understands_review === true ? "I understand applications are reviewed before approval." : "",
      ].filter(Boolean),
    },
  };
}

function matches(application: AdminApplication, search: string, status: AdminApplicationStatus | "") {
  const normalizedSearch = search.trim().toLowerCase();
  return (!normalizedSearch || application.applicantName.toLowerCase().includes(normalizedSearch) || application.email.toLowerCase().includes(normalizedSearch))
    && (!status || application.status === status);
}

export async function listAdminApplications(search: string, status: AdminApplicationStatus | "") {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load applications.");

  const applications = (data ?? [])
    .map((row) => rowToApplication(row as Record<string, unknown>))
    .filter((application) => matches(application, search, status));
  const response: AdminApplicationsResponse = { applications, total: applications.length };
  return response;
}

export async function getAdminApplicationDetails(id: string) {
  const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();
  if (error || !data) throw new Error("Unable to load application details.");
  return rowToApplication(data as Record<string, unknown>);
}

export async function updateAdminApplicationStatus(id: string, status: AdminApplicationStatus) {
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .single();
  if (error || !data) throw new Error("Unable to update application status.");
  return data as { id: string; status: AdminApplicationStatus };
}
