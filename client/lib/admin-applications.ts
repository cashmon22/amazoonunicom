import type { AdminApplication, AdminApplicationStatus, AdminApplicationsResponse } from "@shared/admin-applications";
import { supabase } from "./supabase";

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

const applicationFields = "application_id, submission_date, review_status, first_name, last_name, email, phone, country, time_zone, interests, hours, experience, reason, eligibility";

function rowToApplication(row: ApplicationRow): AdminApplication {
  return {
    id: row.application_id,
    applicantName: `${row.first_name} ${row.last_name}`.trim() || "Unnamed applicant",
    email: row.email,
    phone: row.phone,
    applicationDate: row.submission_date,
    status: row.review_status,
    details: {
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
    },
  };
}

async function getApplicationRows() {
  const { data, error } = await supabase
    .from("applications")
    .select(applicationFields)
    .order("submission_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ApplicationRow[];
}

export async function listAdminApplications(search: string, status: AdminApplicationStatus | ""): Promise<AdminApplicationsResponse> {
  const query = search.trim().toLowerCase();
  const applications = (await getApplicationRows())
    .map(rowToApplication)
    .filter((application) =>
      (!query || application.applicantName.toLowerCase().includes(query) || application.email.toLowerCase().includes(query)) &&
      (!status || application.status === status),
    );
  return { applications, total: applications.length };
}

export async function getAdminApplicationDetails(id: string) {
  const { data, error } = await supabase
    .from("applications")
    .select(applicationFields)
    .eq("application_id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Application not found.");
  return rowToApplication(data as ApplicationRow);
}

export async function updateAdminApplicationStatus(id: string, status: AdminApplicationStatus) {
  const { data, error } = await supabase
    .from("applications")
    .update({ review_status: status })
    .eq("application_id", id)
    .select("application_id")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Application not found.");
  return { id, status };
}
