import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "list") {
      const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 200 });
      if (error) throw error;
      const ids = list.users.map((u) => u.id);
      const { data: statuses } = await admin
        .from("user_status")
        .select("*")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const { data: roles } = await admin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

      const merged = list.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        status: statuses?.find((s) => s.user_id === u.id) || null,
        roles: roles?.filter((r) => r.user_id === u.id).map((r) => r.role) || [],
      }));
      return new Response(JSON.stringify({ users: merged }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_status") {
      const { user_id, banned, warning_message } = body;
      const payload: Record<string, unknown> = { user_id };
      if (typeof banned === "boolean") payload.banned = banned;
      if (warning_message !== undefined) {
        payload.warning_message = warning_message;
        payload.warning_acknowledged = false;
      }
      const { error } = await admin
        .from("user_status")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_user") {
      const { user_id } = body;
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
