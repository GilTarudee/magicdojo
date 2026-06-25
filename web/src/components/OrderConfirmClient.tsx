"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtBaht } from "@/lib/i18n";

type OrderView = {
  id: string;
  customerName: string;
  payMethod: string;
  status: string;
  subtotalThb: number;
  shippingThb: number;
  totalThb: number;
  items: { name: string; setCode: string; finish: string; unitPriceThb: number; qty: number }[];
};

type PayInfo = {
  method: string;
  bankInfo: string;
  qrDataUrl: string | null;
  promptpayId: string | null;
};

export default function OrderConfirmClient({ order, pay }: { order: OrderView; pay: PayInfo }) {
  const { L } = useStore();
  const payLabel = order.payMethod === "promptpay" ? L.payPromptPay : L.payTransfer;

  return (
    <main className="mdscreen" style={{ maxWidth: 600, margin: "0 auto", padding: "56px 24px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 74, height: 74, borderRadius: 999, background: "var(--accent)", color: "var(--accentInk)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="md-head" style={{ fontSize: 34, margin: "0 0 10px" }}>{L.orderPlaced}</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 22px" }}>{L.orderThanks}</p>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: "16px 28px", marginBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)" }}>{L.orderId}</span>
          <span className="md-num" style={{ fontWeight: 600, fontSize: 22, color: "var(--accent)" }}>{order.id}</span>
        </div>
      </div>

      {/* payment instructions */}
      {order.status === "pending" && (
        <div style={{ border: "var(--bw) solid var(--accent)", borderRadius: "var(--radius)", background: "color-mix(in srgb, var(--accent) 5%, var(--panel))", padding: 22, textAlign: "center", marginBottom: 22 }}>
          {order.payMethod === "promptpay" ? (
            pay.qrDataUrl ? (
              <>
                <div className="md-head" style={{ fontSize: 16, marginBottom: 14 }}>{L.ppTitle}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pay.qrDataUrl} alt="PromptPay QR" width={220} height={220} style={{ display: "block", margin: "0 auto", borderRadius: 8, background: "#fff", padding: 8 }} />
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
                  {L.ppNumber}: <span className="md-num" style={{ color: "var(--ink)", fontWeight: 600 }}>{pay.promptpayId}</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{L.payAmount} </span>
                  <span className="md-num" style={{ fontWeight: 600, fontSize: 18, color: "var(--accent)" }}>฿{fmtBaht(order.totalThb)}</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13.5, color: "var(--muted)" }}>{L.ppNotSet}</div>
            )
          ) : (
            <>
              <div className="md-head" style={{ fontSize: 16, marginBottom: 10 }}>{L.bankTitle}</div>
              <div style={{ fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{pay.bankInfo || "—"}</div>
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{L.payAmount} </span>
                <span className="md-num" style={{ fontWeight: 600, fontSize: 18, color: "var(--accent)" }}>฿{fmtBaht(order.totalThb)}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* order detail card */}
      <div style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", boxShadow: "var(--shadow)", padding: 20, textAlign: "left", marginBottom: 22 }}>
        <div className="md-head" style={{ fontSize: 16, marginBottom: 14 }}>{L.orderItems}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {order.items.map((i, n) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5 }}>
              <span style={{ minWidth: 0 }}>
                {i.name}
                <span style={{ color: "var(--muted)" }}> · {i.finish === "foil" ? L.vFoil : L.vNonFoil} ×{i.qty}</span>
              </span>
              <span className="md-num" style={{ flex: "none" }}>฿{fmtBaht(i.unitPriceThb * i.qty)}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "var(--bw) solid var(--line)", margin: "14px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 7 }}>
          <span style={{ color: "var(--muted)" }}>{L.subtotal}</span>
          <span className="md-num">฿{fmtBaht(order.subtotalThb)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 7 }}>
          <span style={{ color: "var(--muted)" }}>{L.shipping}</span>
          <span className="md-num">{order.shippingThb === 0 ? L.free : `฿${fmtBaht(order.shippingThb)}`}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{L.total}</span>
          <span className="md-num" style={{ fontWeight: 600, fontSize: 20, color: "var(--accent)" }}>฿{fmtBaht(order.totalThb)}</span>
        </div>
        <div style={{ borderTop: "var(--bw) solid var(--line)", margin: "14px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: "var(--muted)" }}>{L.coPay}</span>
          <span style={{ fontWeight: 500 }}>{payLabel}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>{L.orderStatus}</span>
          <span style={{ fontWeight: 600, color: "var(--accent)" }}>{L.statusPending}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, lineHeight: 1.5, borderTop: "var(--bw) solid var(--line)", paddingTop: 14 }}>{L.payNote}</div>
      </div>

      <div style={{ textAlign: "center", display: "flex", gap: 10, justifyContent: "center" }}>
        <Link href="/shop" style={{ border: "var(--bw) solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 14, padding: "12px 26px", borderRadius: "var(--btnr)" }}>{L.viewShop}</Link>
        <Link href="/" style={{ background: "var(--accent)", color: "var(--accentInk)", fontWeight: 600, fontSize: 14, padding: "12px 26px", borderRadius: "var(--btnr)" }}>{L.backHome}</Link>
      </div>
    </main>
  );
}
