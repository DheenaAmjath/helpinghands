import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const allowedRoles = ["donor", "requester", "verifier", "admin"];

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json(
      { error: "Sign in required", signIn: "/signin-with-chatgpt?return_to=%2Fdashboard" },
      { status: 401 },
    );
  }
  const body = (await request.json()) as { role?: string };
  const role = allowedRoles.includes(body.role ?? "") ? body.role! : "donor";
  await env.DB.prepare(
    "INSERT INTO users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name, role=excluded.role",
  ).bind(user.userId, user.email, user.displayName, role, Date.now()).run();
  return Response.json({ ok: true, role });
}
