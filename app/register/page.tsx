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
  if (!requestedRole || !roles.includes(requestedRole)) {
    const choices = [
      ["donor", "♡", "Donor", "Give useful items to verified needs"],
      ["requester", "◇", "Requester", "Submit a need for community review"],
      ["verifier", "✓", "Verifier", "Help review genuine community needs"],
      ["admin", "⚙", "Administrator", "Manage trust, safety and platform activity"],
    ];
    return <main className="registration-page"><section className="donation-modal auth-modal"><a className="close" href="/" aria-label="Close registration">×</a><p className="eyebrow">CREATE YOUR ACCOUNT</p><h2>How will you use Helping Hands?</h2><p>Choose your primary role. Verifier and administrator access requires approval.</p><div className="role-grid four-roles">{choices.map(([role, icon, title, copy]) => <a className="onboarding-role" key={role} href={`/register?role=${role}`}><span>{icon}</span><strong>{title}</strong><small>{copy}</small></a>)}</div><p className="auth-switch">Already registered? <a href="/login">Login securely</a></p><small className="auth-privacy">Your private contact details and residential address are never published.</small></section></main>;
  }
  const role = requestedRole;
  const user = await requireChatGPTUser(`/register?role=${encodeURIComponent(role)}`);
  await env.DB.prepare(
    "INSERT INTO users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name, role=excluded.role",
  ).bind(user.userId, user.email, user.displayName, role, Date.now()).run();
  redirect("/dashboard?registered=1");
}
