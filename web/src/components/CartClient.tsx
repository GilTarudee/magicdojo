"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { colorKey, glyphFor, artBgFor, fmtBaht, shippingFor } from "@/lib/i18n";

export default function CartClient() {
  const { L, cart, cartCount, changeQty, removeLine } = useStore();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((s, l) => s + l.unitPriceThb * l.qty, 0);
  const ship = shippingFor(subtotal);
  const total = subtotal + ship;

  async function checkout() {
    setPlacing(true);
    router.push("/checkout");
  }

  return (
    <main className="mdscreen" style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px 48px" }}>
      <h1 className="md-head" style={{ fontSize: 32, margin: "0 0 22px" }}>
        {L.cartTitle}
      </h1>

      {cart.length > 0 ? (
        <div className="md-cart-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.map((l) => {
              const ck = colorKey(l.colors);
              return (
                <div
                  key={`${l.productId}-${l.finish}`}
                  style={{ display: "flex", gap: 14, alignItems: "center", border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: 13 }}
                >
                  <Link
                    href={`/product/${l.productId}`}
                    style={{ width: 54, height: 74, borderRadius: "var(--btnr)", flex: "none", background: artBgFor(ck), position: "relative", overflow: "hidden", display: "block" }}
                  >
                    {l.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.imageUrl} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--headf)", fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,.22)" }}>
                        {glyphFor(ck)}
                      </div>
                    )}
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="md-head" style={{ fontWeight: 600, fontSize: 15 }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {l.setName} · {l.finish === "foil" ? L.vFoil : L.vNonFoil}
                    </div>
                    <div className="md-num" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginTop: 3 }}>
                      ฿{fmtBaht(l.unitPriceThb)} {L.each}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", border: "var(--bw) solid var(--line)", borderRadius: 999, overflow: "hidden", flex: "none" }}>
                    <button onClick={() => changeQty(l.productId, l.finish, -1)} style={{ cursor: "pointer", border: "none", background: "transparent", width: 30, height: 32, fontSize: 17, color: "var(--ink)" }}>−</button>
                    <span className="md-num" style={{ fontWeight: 600, minWidth: 26, textAlign: "center", fontSize: 14 }}>{l.qty}</span>
                    <button
                      onClick={() => changeQty(l.productId, l.finish, 1)}
                      disabled={l.qty >= l.maxStock}
                      style={{ cursor: l.qty >= l.maxStock ? "not-allowed" : "pointer", border: "none", background: "transparent", width: 30, height: 32, fontSize: 16, color: l.qty >= l.maxStock ? "var(--muted)" : "var(--ink)" }}
                    >
                      +
                    </button>
                  </div>
                  <div className="md-num" style={{ fontWeight: 600, fontSize: 15, width: 74, textAlign: "right", flex: "none" }}>
                    ฿{fmtBaht(l.unitPriceThb * l.qty)}
                  </div>
                  <button onClick={() => removeLine(l.productId, l.finish)} title={L.remove} style={{ cursor: "pointer", border: "none", background: "transparent", color: "var(--muted)", flex: "none", padding: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <aside style={{ position: "sticky", top: 84, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", boxShadow: "var(--shadow)", padding: 20 }}>
            <div className="md-head" style={{ fontSize: 18, marginBottom: 16 }}>{L.summary}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 9 }}>
              <span style={{ color: "var(--muted)" }}>{L.subtotal} ({cartCount})</span>
              <span className="md-num" style={{ fontWeight: 600 }}>฿{fmtBaht(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 9 }}>
              <span style={{ color: "var(--muted)" }}>{L.shipping}</span>
              <span className="md-num">{ship === 0 ? L.free : `฿${fmtBaht(ship)}`}</span>
            </div>
            <div style={{ borderTop: "var(--bw) solid var(--line)", margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{L.total}</span>
              <span className="md-num" style={{ fontWeight: 600, fontSize: 23, color: "var(--accent)" }}>฿{fmtBaht(total)}</span>
            </div>
            <button
              onClick={checkout}
              disabled={placing}
              className="md-head"
              style={{ cursor: "pointer", width: "100%", border: "none", background: "var(--accent)", color: "var(--accentInk)", fontWeight: 600, fontSize: 15, padding: 14, borderRadius: "var(--btnr)" }}
            >
              {L.checkout}
            </button>
            <Link
              href="/shop"
              style={{ display: "block", textAlign: "center", width: "100%", border: "none", background: "transparent", color: "var(--muted)", fontWeight: 500, fontSize: 13, padding: 11, marginTop: 4 }}
            >
              {L.continue}
            </Link>
          </aside>
        </div>
      ) : (
        <div style={{ border: "var(--bw) dashed var(--line)", borderRadius: "var(--radius)", padding: 64, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>🃏</div>
          <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{L.emptyCart}</div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 22 }}>{L.emptyCartSub}</div>
          <Link href="/shop" style={{ display: "inline-block", border: "none", background: "var(--accent)", color: "var(--accentInk)", fontWeight: 600, fontSize: 14, padding: "12px 24px", borderRadius: "var(--btnr)" }}>
            {L.heroCta}
          </Link>
        </div>
      )}
    </main>
  );
}
