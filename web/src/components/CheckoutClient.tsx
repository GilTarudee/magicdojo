"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { fmtBaht, shippingFor } from "@/lib/i18n";
import { placeOrder } from "@/app/checkout/actions";

type Initial = { name: string; phone: string; email: string; address: string };

export default function CheckoutClient({ initial }: { initial?: Initial }) {
  const { L, cart, cartCount, clearCart, showToast } = useStore();
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [note, setNote] = useState("");
  const [pay, setPay] = useState<"transfer" | "promptpay">("transfer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((s, l) => s + l.unitPriceThb * l.qty, 0);
  const ship = shippingFor(subtotal);
  const total = subtotal + ship;

  if (cart.length === 0) {
    return (
      <main className="mdscreen" style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>🃏</div>
        <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{L.emptyCart}</div>
        <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 22 }}>{L.emptyCartSub}</div>
        <Link href="/shop" style={{ display: "inline-block", background: "var(--accent)", color: "var(--accentInk)", fontWeight: 600, fontSize: 14, padding: "12px 24px", borderRadius: "var(--btnr)" }}>
          {L.heroCta}
        </Link>
      </main>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError(L.coErrName);
      return;
    }
    setBusy(true);
    const res = await placeOrder({
      items: cart.map((l) => ({ productId: l.productId, finish: l.finish, qty: l.qty })),
      customerName: name,
      phone,
      email,
      address,
      note,
      payMethod: pay,
    });
    if (res.ok) {
      clearCart();
      router.push(`/order/${res.orderId}`);
      return;
    }
    setBusy(false);
    if (res.error === "stock") setError(`${L.coErrStock}${res.issues?.length ? ` (${res.issues.join(", ")})` : ""}`);
    else if (res.error === "name") setError(L.coErrName);
    else setError(L.coErrGeneric);
    showToast(L.coErrGeneric);
  }

  const field: React.CSSProperties = {
    width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)",
    background: "var(--panel)", padding: "11px 12px", fontSize: 14, color: "var(--ink)", outline: "none",
  };
  const fieldLabel: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "var(--ink)", marginBottom: 6, display: "block" };

  return (
    <main className="mdscreen" style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px 48px" }}>
      <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13.5, fontWeight: 500, marginBottom: 16 }}>← {L.cartTitle}</Link>
      <h1 className="md-head" style={{ fontSize: 32, margin: "0 0 22px" }}>{L.checkout}</h1>

      <form onSubmit={submit} className="md-checkout-layout">
        {/* form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: 22 }}>
          <div className="md-head" style={{ fontSize: 18 }}>{L.coContact}</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={fieldLabel}>{L.coName} *</label>
              <input style={field} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label style={fieldLabel}>{L.coPhone} *</label>
              <input style={field} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
            </div>
          </div>

          <div>
            <label style={fieldLabel}>{L.coEmail} <span style={{ color: "var(--muted)", fontWeight: 400 }}>{L.optional}</span></label>
            <input style={field} value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
          </div>

          <div>
            <label style={fieldLabel}>{L.coAddress} <span style={{ color: "var(--muted)", fontWeight: 400 }}>{L.optional}</span></label>
            <textarea style={{ ...field, minHeight: 70, resize: "vertical" }} value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div>
            <label style={fieldLabel}>{L.coNote} <span style={{ color: "var(--muted)", fontWeight: 400 }}>{L.optional}</span></label>
            <input style={field} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div>
            <label style={fieldLabel}>{L.coPay}</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { k: "transfer", label: L.payTransfer },
                { k: "promptpay", label: L.payPromptPay },
              ] as const).map((o) => (
                <label key={o.k} style={{ display: "flex", alignItems: "center", gap: 10, border: `var(--bw) solid ${pay === o.k ? "var(--accent)" : "var(--line)"}`, borderRadius: "var(--btnr)", padding: "11px 13px", cursor: "pointer" }}>
                  <input type="radio" name="pay" checked={pay === o.k} onChange={() => setPay(o.k)} style={{ accentColor: "var(--accent)" }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{o.label}</span>
                </label>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>{L.payNote}</div>
          </div>
        </div>

        {/* summary */}
        <aside style={{ position: "sticky", top: 84, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", boxShadow: "var(--shadow)", padding: 20 }}>
          <div className="md-head" style={{ fontSize: 18, marginBottom: 16 }}>{L.summary}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {cart.map((l) => (
              <div key={`${l.productId}-${l.finish}`} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}>
                <span style={{ color: "var(--muted)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {l.name} <span style={{ opacity: 0.7 }}>×{l.qty}</span>
                </span>
                <span className="md-num" style={{ flex: "none" }}>฿{fmtBaht(l.unitPriceThb * l.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "var(--bw) solid var(--line)", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 9 }}>
              <span style={{ color: "var(--muted)" }}>{L.subtotal} ({cartCount})</span>
              <span className="md-num" style={{ fontWeight: 600 }}>฿{fmtBaht(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 9 }}>
              <span style={{ color: "var(--muted)" }}>{L.shipping}</span>
              <span className="md-num">{ship === 0 ? L.free : `฿${fmtBaht(ship)}`}</span>
            </div>
            <div style={{ borderTop: "var(--bw) solid var(--line)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{L.total}</span>
              <span className="md-num" style={{ fontWeight: 600, fontSize: 23, color: "var(--accent)" }}>฿{fmtBaht(total)}</span>
            </div>
          </div>

          {error && (
            <div style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", border: "var(--bw) solid var(--accent)", borderRadius: "var(--btnr)", padding: "10px 12px", fontSize: 12.5, marginBottom: 12, lineHeight: 1.4 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={busy} className="md-head"
            style={{ cursor: busy ? "wait" : "pointer", width: "100%", border: "none", background: "var(--accent)", color: "var(--accentInk)", fontWeight: 600, fontSize: 15, padding: 14, borderRadius: "var(--btnr)", opacity: busy ? 0.7 : 1 }}>
            {busy ? L.coPlacing : L.coPlace}
          </button>
        </aside>
      </form>
    </main>
  );
}
