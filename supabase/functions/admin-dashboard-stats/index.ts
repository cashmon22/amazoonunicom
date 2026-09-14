import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const availableDeviceCount = 3;

type DashboardStats = {
  users: number;
  applications: number;
  deviceRequests: number;
  availableDevices: number;
};

function json(body: DashboardStats | { error: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return json({ error: "Authentication required" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return json({ error: "Dashboard statistics are not configured." }, 503);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || userData.user?.app_metadata?.role !== "admin") {
    return json({ error: userData.user ? "Administrator access required" : "Authentication required" }, userData.user ? 403 : 401);
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [applications, deviceRequests] = await Promise.all([
    serviceClient.from("applications").select("application_id", { count: "exact", head: true }),
    serviceClient.from("payment_requests").select("id", { count: "exact", head: true }),
  ]);
  if (applications.error || deviceRequests.error) {
    return json({ error: "Unable to load dashboard statistics." }, 500);
  }

  const perPage = 1000;
  let users = 0;
  for (let page = 1; ; page += 1) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return json({ error: "Unable to load dashboard statistics." }, 500);
    users += data.users.length;
    if (data.users.length < perPage) break;
  }

  return json({
    users,
    applications: applications.count ?? 0,
    deviceRequests: deviceRequests.count ?? 0,
    availableDevices: availableDeviceCount,
  });
});
