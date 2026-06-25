"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { badgeFor, colorKey, glyphFor, artBgFor, fmtBaht } from "@/lib/i18n";
import type { CardView } from "@/lib/products";

export default function ProductCard({ p }: { p: CardView }) {
  const { L, lang } = useStore();
  const ck = colorKey(p.colors);
  const badge = badgeFor(p.totalStock, L);
  const availCodes = p.variants
    .filter((v) => v.stock > 0)
    .map((v) => (v.finish === "foil" ? L.vFoil : L.vNonFoil));

  return (
    <Link
      href={`/product/${p.id}`}
      style={{
        display: "block",
        border: "var(--bw) solid var(--line)",
        borderRadius: "var(--radius)",
        background: "var(--panel)",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "5 / 7", background: artBgFor(ck) }}>
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imageUrl}
            alt={p.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--headf)",
              fontWeight: 700,
              fontSize: 78,
              color: "rgba(255,255,255,.16)",
            }}
          >
            {glyphFor(ck)}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,rgba(0,0,0,.28))",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "absolute", top: 9, right: 9, display: "flex", gap: 4 }}>
          {availCodes.map((cc, i) => (
            <span
              key={i}
              className="md-num"
              style={{
                background: "rgba(0,0,0,.55)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".03em",
                padding: "3px 6px",
                borderRadius: 4,
                boxShadow: "0 1px 2px rgba(0,0,0,.3)",
              }}
            >
              {cc}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 9,
            fontSize: 10,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.78)",
            fontWeight: 600,
          }}
        >
          {p.setCode}
        </div>
      </div>
      <div style={{ padding: "13px 14px 15px" }}>
        <div
          className="md-head"
          style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2, marginBottom: 8, minHeight: 36 }}
        >
          {p.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {p.priceFromThb != null && (
              <>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{L.from} </span>
                <span
                  className="md-num"
                  style={{ fontWeight: 600, fontSize: 15, color: "var(--accent)" }}
                >
                  ฿{fmtBaht(p.priceFromThb)}
                </span>
              </>
            )}
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: ".04em",
              padding: "3px 8px",
              borderRadius: 999,
              background: badge.bg,
              color: badge.fg,
              border: badge.border,
            }}
          >
            {badge.text}
          </span>
        </div>
        {/* lang keeps card text reactive to language toggle */}
        <span hidden>{lang}</span>
      </div>
    </Link>
  );
}
