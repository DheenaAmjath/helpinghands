import { env } from "cloudflare:workers";
import { redirect } from "next/navigation";
import { requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";
const roles = ["donor", "requester", "verifier", "admin"];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role: requestedRole } = await searchParams;
  const role = roles.includes(requestedRole ?? "") ? requestedRole! : "donor";
  const user = await requireChatGPTUser(`/register?role=${encodeURIComponent(role)}`);
  await env.DB.prepare(
    "INSERT INTO users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name, role=excluded.role",
  ).bind(user.userId, user.email, user.displayName, role, Date.now()).run();
  redirect("/dashboard?registered=1");
}
