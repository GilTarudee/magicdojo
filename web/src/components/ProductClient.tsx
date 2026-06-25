"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { colorKey, glyphFor, artBgFor, badgeFor, fmtBaht } from "@/lib/i18n";
import type { CardView } from "@/lib/products";

export default function ProductClient({ p }: { p: CardView }) {
  const { L, addToCart } = useStore();
  const ck = colorKey(p.colors);
  const badge = badgeFor(p.totalStock, L);
  const rarityLabel = p.rarity ? L.rar[p.rarity] ?? p.rarity : "";

  function stockLabel(stock: number) {
    if (stock <= 0) return L.out;
    if (stock <= 3) return `${L.onlyLeft} ${stock} ${L.unitsLeft}`;
    return L.inStock;
  }

  const facts = [
    { k: L.factSet, v: `${p.setName} · ${p.setCode}` },
    { k: L.factRarity, v: rarityLabel },
    { k: L.factType, v: p.typeLine ?? "—" },
  ];

  return (
    <main className="mdscreen" style={{ maxWidth: 1080, margin: "0 auto", padding: 24 }}>
      <Link
        href="/shop"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13.5, fontWeight: 500, marginBottom: 20 }}
      >
        ← {L.backToShop}
      </Link>

      <div className="md-product-layout">
        {/* art */}
        <div
          style={{
            position: "relative", borderRadius: "var(--radius)", overflow: "hidden",
            border: "var(--bw) solid var(--line)", boxShadow: "var(--shadow)", aspectRatio: "5 / 7", background: artBgFor(ck),
          }}
        >
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.2),transparent 38%,rgba(0,0,0,.34))" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--headf)", fontWeight: 700, fontSize: 200, color: "rgba(255,255,255,.15)" }}>
                {glyphFor(ck)}
              </div>
              <div style={{ position: "absolute", top: 16, left: 16, right: 16 }}>
                <span style={{ fontFamily: "var(--headf)", fontWeight: 700, color: "#fff", fontSize: 19, textShadow: "0 1px 4px rgba(0,0,0,.4)" }}>
                  {p.name}
                </span>
              </div>
            </>
          )}
        </div>

        {/* info */}
        <div>
          <div style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
            {p.setName} · {p.setCode}
          </div>
          <h1 className="md-head" style={{ fontSize: 38, lineHeight: 1.05, margin: "0 0 10px" }}>
            {p.name}
          </h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
            {rarityLabel && (
              <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 11px", borderRadius: 999, background: "var(--panel2)", border: "var(--bw) solid var(--line)" }}>
                {rarityLabel}
              </span>
            )}
            {p.typeLine && <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.typeLine}</span>}
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".04em", padding: "4px 10px", borderRadius: 999, background: badge.bg, color: badge.fg, border: badge.border }}>
              {badge.text}
            </span>
          </div>

          <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 10 }}>
            {L.chooseCondition}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {p.variants.map((v) => {
              const disabled = v.stock <= 0;
              return (
                <div
                  key={v.finish}
                  style={{ display: "flex", alignItems: "center", gap: 14, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: "13px 15px", opacity: disabled ? 0.55 : 1 }}
                >
                  <div style={{ width: 104, flex: "none" }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{v.finish === "foil" ? L.vFoil : L.vNonFoil}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{stockLabel(v.stock)}</div>
                  </div>
                  <div className="md-num" style={{ fontWeight: 600, fontSize: 18, color: "var(--ink)", flex: "none" }}>
                    ฿{fmtBaht(v.priceThb)}
                  </div>
                  <button
                    disabled={disabled}
                    onClick={() =>
                      addToCart({
                        productId: p.id, finish: v.finish, name: p.name, setCode: p.setCode, setName: p.setName,
                        colors: p.colors, unitPriceThb: v.priceThb, imageUrl: p.imageUrl, maxStock: v.stock,
                      })
                    }
                    className="md-head"
                    style={{
                      cursor: disabled ? "not-allowed" : "pointer", border: "none",
                      background: disabled ? "var(--panel2)" : "var(--accent)",
                      color: disabled ? "var(--muted)" : "var(--accentInk)",
                      borderRadius: "var(--btnr)", height: 38, padding: "0 16px", fontSize: 13, fontWeight: 600, flex: "none",
                    }}
                  >
                    {disabled ? L.sold : L.add}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, borderTop: "var(--bw) solid var(--line)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 9 }}>
            {facts.map((f) => (
              <div key={f.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>{f.k}</span>
                <span style={{ fontWeight: 500 }}>{f.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
