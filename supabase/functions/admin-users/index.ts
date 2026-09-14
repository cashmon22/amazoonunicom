import { createClient, type User } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AdminUserStatus = "Active" | "Suspended";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: AdminUserStatus;
  lastSignInAt: string | null;
};

type RequestBody = {
  action?: "list" | "details" | "update-status";
  search?: string;
  id?: string;
  status?: AdminUserStatus;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toAdminUser(user: User): AdminUser {
  const name = typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
    ? user.user_metadata.full_name.trim()
    : user.email?.split("@")[0] || "Unnamed user";
  const isSuspended = Boolean(user.banned_until && new Date(user.banned_until).getTime() > Date.now());

  return {
    id: user.id,
    name,
    email: user.email ?? "",
    createdAt: user.created_at,
    status: isSuspended ? "Suspended" : "Active",
    lastSignInAt: user.last_sign_in_at ?? null,
  };
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
    return json({ error: "Admin user data is not configured." }, 503);
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
    const users: User[] = [];
    const perPage = 1000;
    for (let page = 1; ; page += 1) {
      const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
      if (error) return json({ error: "Unable to load users." }, 500);
      users.push(...data.users);
      if (data.users.length < perPage) break;
    }

    const search = typeof body.search === "string" ? body.search.trim().toLowerCase() : "";
    const safeUsers = users
      .map(toAdminUser)
      .filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
    return json({ users: safeUsers, total: safeUsers.length });
  }

  if (body.action === "details" || body.action === "update-status") {
    if (!body.id) return json({ error: "A user id is required." }, 400);
    if (body.action === "update-status" && body.status !== "Active" && body.status !== "Suspended") {
      return json({ error: "Invalid account status." }, 400);
    }

    const result = body.action === "details"
      ? await serviceClient.auth.admin.getUserById(body.id)
      : await serviceClient.auth.admin.updateUserById(body.id, {
          ban_duration: body.status === "Suspended" ? "876000h" : "none",
        });
    if (result.error || !result.data.user) {
      return json({ error: body.action === "details" ? "User not found." : "Unable to update account status." }, body.action === "details" ? 404 : 500);
    }
    return json(toAdminUser(result.data.user));
  }

  return json({ error: "Invalid action." }, 400);
});
