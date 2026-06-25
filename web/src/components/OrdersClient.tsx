"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtBaht } from "@/lib/i18n";
import { updateOrderStatus, type OrderStatus } from "@/app/admin/actions";

type OrderRow = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  payMethod: string;
  status: string;
  totalThb: number;
  items: { name: string; finish: string; qty: number; unitPriceThb: number }[];
};

function statusStyle(status: string): { bg: string; fg: string; border: string } {
  switch (status) {
    case "paid":
      return { bg: "#1f8f4f", fg: "#fff", border: "none" };
    case "shipped":
      return { bg: "#2f6fb0", fg: "#fff", border: "none" };
    case "cancelled":
      return { bg: "var(--panel2)", fg: "var(--muted)", border: "var(--bw) solid var(--line)" };
    default:
      return { bg: "var(--accent)", fg: "var(--accentInk)", border: "none" };
  }
}

export default function OrdersClient({ orders }: { orders: OrderRow[] }) {
  const { L, lang } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const statusLabel: Record<string, string> = {
    pending: L.statusPending,
    paid: L.statusPaid,
    shipped: L.statusShipped,
    cancelled: L.statusCancelled,
  };

  function setStatus(id: string, status: OrderStatus) {
    startTransition(() => updateOrderStatus(id, status));
  }

  const btn: React.CSSProperties = {
    cursor: "pointer", border: "var(--bw) solid var(--line)", background: "var(--panel)",
    color: "var(--ink)", borderRadius: "var(--btnr)", padding: "6px 11px", fontSize: 12, fontWeight: 600,
  };

  return (
    <main className="mdscreen" style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 48px" }}>
      <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13.5, fontWeight: 500, marginBottom: 16 }}>← {L.backToAdmin}</Link>
      <h1 className="md-head" style={{ fontSize: 32, margin: "0 0 4px" }}>{L.ordersTitle}</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 22px", fontSize: 14 }}>{L.ordersSub}</p>

      {orders.length === 0 ? (
        <div style={{ border: "var(--bw) dashed var(--line)", borderRadius: "var(--radius)", padding: 60, textAlign: "center", color: "var(--muted)" }}>{L.noOrders}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((o) => {
            const ss = statusStyle(o.status);
            const open = expanded === o.id;
            const date = new Date(o.createdAt).toLocaleString(lang === "th" ? "th-TH" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
            const itemCount = o.items.reduce((s, i) => s + i.qty, 0);
            return (
              <div key={o.id} style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                <div
                  onClick={() => setExpanded(open ? null : o.id)}
                  style={{ display: "grid", gridTemplateColumns: "140px 1fr 90px 110px 110px", gap: 12, alignItems: "center", padding: "14px 16px", cursor: "pointer" }}
                >
                  <div>
                    <div className="md-num" style={{ fontWeight: 600, fontSize: 14, color: "var(--accent)" }}>{o.id}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{date}</div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customerName}</div>
                    <div className="md-num" style={{ fontSize: 12, color: "var(--muted)" }}>{o.phone}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{itemCount} {L.cardsWord}</div>
                  <div className="md-num" style={{ fontWeight: 600, fontSize: 15 }}>฿{fmtBaht(o.totalThb)}</div>
                  <div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: ss.bg, color: ss.fg, border: ss.border }}>{statusLabel[o.status] ?? o.status}</span>
                  </div>
                </div>

                {open && (
                  <div style={{ borderTop: "var(--bw) solid var(--line)", padding: "14px 16px", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" }}>
                    <div style={{ minWidth: 220 }}>
                      <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>{L.orderItems}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {o.items.map((i, n) => (
                          <div key={n} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 13 }}>
                            <span>{i.name} <span style={{ color: "var(--muted)" }}>· {i.finish === "foil" ? L.vFoil : L.vNonFoil} ×{i.qty}</span></span>
                            <span className="md-num">฿{fmtBaht(i.unitPriceThb * i.qty)}</span>
                          </div>
                        ))}
                      </div>
                      {(o.address || o.email || o.note) && (
                        <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
                          {o.email && <div>✉ {o.email}</div>}
                          {o.address && <div>📍 {o.address}</div>}
                          {o.note && <div>📝 {o.note}</div>}
                          <div>💳 {o.payMethod === "promptpay" ? L.payPromptPay : L.payTransfer}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {o.status !== "paid" && o.status !== "cancelled" && (
                          <button style={{ ...btn, borderColor: "#1f8f4f", color: "#1f8f4f" }} onClick={() => setStatus(o.id, "paid")}>{L.markPaid}</button>
                        )}
                        {o.status === "paid" && (
                          <button style={{ ...btn, borderColor: "#2f6fb0", color: "#2f6fb0" }} onClick={() => setStatus(o.id, "shipped")}>{L.markShipped}</button>
                        )}
                        {o.status !== "cancelled" ? (
                          <button style={{ ...btn, borderColor: "var(--line)", color: "var(--muted)" }} onClick={() => setStatus(o.id, "cancelled")}>{L.cancelOrder}</button>
                        ) : (
                          <button style={btn} onClick={() => setStatus(o.id, "pending")}>{L.reopen}</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
