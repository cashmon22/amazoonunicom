import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AdminApplicationStatus = "Under Review" | "Approved" | "Rejected";

type AdminApplication = {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: AdminApplicationStatus;
  details: Record<string, unknown>;
};

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

type RequestBody = {
  action?: "list" | "details" | "update-status";
  search?: string;
  status?: AdminApplicationStatus;
  id?: string;
};

const applicationSelect = "application_id, submission_date, review_status, first_name, last_name, email, phone, country, time_zone, interests, hours, experience, reason, eligibility";
const allowedStatuses: AdminApplicationStatus[] = ["Under Review", "Approved", "Rejected"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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

async function getApplications(serviceClient: ReturnType<typeof createClient>) {
  const { data, error } = await serviceClient
    .from("applications")
    .select(applicationSelect)
    .order("submission_date", { ascending: false });
  if (error) return { error };
  return { applications: (data as ApplicationRow[]).map(rowToApplication) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return json({ error: "Authentication required" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return json({ error: "Admin application data is not configured." }, 503);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: "Authentication required" }, 401);
  if (userData.user.app_metadata?.role !== "admin") {
    return json({ error: "Administrator access required" }, 403);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (body.action === "list") {
    const result = await getApplications(serviceClient);
    if (result.error) return json({ error: "Unable to load applications." }, 500);

    const search = typeof body.search === "string" ? body.search.trim().toLowerCase() : "";
    const applications = result.applications.filter((application) =>
      (!search || application.applicantName.toLowerCase().includes(search) || application.email.toLowerCase().includes(search)) &&
      (!body.status || application.status === body.status),
    );
    return json({ applications, total: applications.length });
  }

  if (body.action === "details") {
    if (!body.id) return json({ error: "An application id is required." }, 400);
    const { data, error } = await serviceClient
      .from("applications")
      .select(applicationSelect)
      .eq("application_id", body.id)
      .maybeSingle();
    if (error || !data) return json({ error: "Application not found." }, 404);
    return json(rowToApplication(data as ApplicationRow));
  }

  if (body.action === "update-status") {
    if (!body.id) return json({ error: "An application id is required." }, 400);
    if (!body.status || !allowedStatuses.includes(body.status)) {
      return json({ error: "Invalid application status." }, 400);
    }
    const { data, error } = await serviceClient
      .from("applications")
      .update({ review_status: body.status })
      .eq("application_id", body.id)
      .select("application_id")
      .maybeSingle();
    if (error) return json({ error: "Unable to update application status." }, 500);
    if (!data) return json({ error: "Application not found." }, 404);
    return json({ id: body.id, status: body.status });
  }

  return json({ error: "Invalid action." }, 400);
});
