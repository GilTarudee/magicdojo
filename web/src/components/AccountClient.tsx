"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useStore } from "@/lib/store";
import { fmtBaht } from "@/lib/i18n";
import { logout } from "@/app/account/actions";

type OrderRow = {
  id: string;
  createdAt: string;
  status: string;
  totalThb: number;
  itemCount: number;
};

type Props = {
  user: { name: string; email: string; phone: string | null; isAdmin: boolean };
  orders: OrderRow[];
};

export default function AccountClient({ user, orders }: Props) {
  const { L, lang } = useStore();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const statusLabel: Record<string, string> = {
    pending: L.statusPending,
    paid: L.statusPaid,
    shipped: L.statusShipped,
    cancelled: L.statusCancelled,
  };

  function doLogout() {
    startTransition(async () => {
      await logout();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <main className="mdscreen" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 48px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div>
          <h1 className="md-head" style={{ fontSize: 30, margin: "0 0 4px" }}>{L.account}</h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>{L.hello}, {user.name}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {user.isAdmin && (
            <Link href="/admin" style={{ border: "var(--bw) solid var(--accent)", color: "var(--accent)", borderRadius: "var(--btnr)", padding: "9px 16px", fontSize: 13.5, fontWeight: 600 }}>{L.adminTitle}</Link>
          )}
          <button onClick={doLogout} disabled={pending} style={{ cursor: "pointer", border: "var(--bw) solid var(--line)", background: "transparent", color: "var(--muted)", borderRadius: "var(--btnr)", padding: "9px 16px", fontSize: 13.5, fontWeight: 600 }}>{L.logout}</button>
        </div>
      </div>

      {/* profile */}
      <div style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 12 }}>{L.profileTitle}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>{L.coName}</span><span style={{ fontWeight: 500 }}>{user.name}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>{L.coEmail}</span><span style={{ fontWeight: 500 }}>{user.email}</span></div>
          {user.phone && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>{L.coPhone}</span><span className="md-num" style={{ fontWeight: 500 }}>{user.phone}</span></div>}
        </div>
      </div>

      {/* orders */}
      <div className="md-head" style={{ fontSize: 18, marginBottom: 14 }}>{L.myOrders}</div>
      {orders.length === 0 ? (
        <div style={{ border: "var(--bw) dashed var(--line)", borderRadius: "var(--radius)", padding: 48, textAlign: "center", color: "var(--muted)" }}>{L.noMyOrders}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => {
            const date = new Date(o.createdAt).toLocaleString(lang === "th" ? "th-TH" : "en-GB", { dateStyle: "medium" });
            return (
              <Link key={o.id} href={`/order/${o.id}`} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 14, alignItems: "center", border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: "14px 16px" }}>
                <div>
                  <div className="md-num" style={{ fontWeight: 600, fontSize: 14, color: "var(--accent)" }}>{o.id}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{date} · {o.itemCount} {L.cardsWord}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: "var(--panel2)", border: "var(--bw) solid var(--line)" }}>{statusLabel[o.status] ?? o.status}</span>
                <span className="md-num" style={{ fontWeight: 600, fontSize: 15 }}>฿{fmtBaht(o.totalThb)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
