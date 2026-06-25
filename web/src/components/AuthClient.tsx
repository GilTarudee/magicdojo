"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { login, register } from "@/app/account/actions";

const ERR: Record<string, string> = {
  missing: "authErrMissing",
  email: "authErrEmail",
  short: "authErrShort",
  exists: "authErrExists",
  invalid: "authErrInvalid",
};

export default function AuthClient() {
  const { L } = useStore();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res =
      mode === "login"
        ? await login({ email, password })
        : await register({ name, email, password, phone });
    if (res.ok) {
      router.push("/account");
      router.refresh();
      return;
    }
    setBusy(false);
    const key = ERR[res.error] ?? "authErrMissing";
    setError((L as unknown as Record<string, string>)[key]);
  }

  const field: React.CSSProperties = {
    width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)",
    background: "var(--bg)", padding: "11px 12px", fontSize: 14, color: "var(--ink)", outline: "none",
  };
  const fieldLabel: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, marginBottom: 6, display: "block" };

  return (
    <main className="mdscreen" style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px" }}>
      <h1 className="md-head" style={{ fontSize: 28, margin: "0 0 6px", textAlign: "center" }}>
        {mode === "login" ? L.login : L.signup}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13.5, textAlign: "center", margin: "0 0 24px" }}>Magic Dojo</p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", boxShadow: "var(--shadow)", padding: 24 }}>
        {mode === "signup" && (
          <div>
            <label style={fieldLabel}>{L.coName}</label>
            <input style={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
        )}
        <div>
          <label style={fieldLabel}>{L.coEmail}</label>
          <input style={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        {mode === "signup" && (
          <div>
            <label style={fieldLabel}>{L.coPhone} <span style={{ color: "var(--muted)", fontWeight: 400 }}>{L.optional}</span></label>
            <input style={field} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
          </div>
        )}
        <div>
          <label style={fieldLabel}>{L.password}</label>
          <input style={field} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </div>

        {error && (
          <div style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", border: "var(--bw) solid var(--accent)", borderRadius: "var(--btnr)", padding: "10px 12px", fontSize: 12.5 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="md-head"
          style={{ cursor: busy ? "wait" : "pointer", border: "none", background: "var(--accent)", color: "var(--accentInk)", fontWeight: 600, fontSize: 15, padding: 13, borderRadius: "var(--btnr)", opacity: busy ? 0.7 : 1 }}>
          {mode === "login" ? L.login : L.signup}
        </button>
      </form>

      <button
        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
        style={{ display: "block", margin: "18px auto 0", border: "none", background: "transparent", color: "var(--accent)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
      >
        {mode === "login" ? L.toSignup : L.toLogin}
      </button>
    </main>
  );
}
