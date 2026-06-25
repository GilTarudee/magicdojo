"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import type { CardView } from "@/lib/products";

export default function HomeClient({ featured }: { featured: CardView[] }) {
  const { L } = useStore();

  return (
    <main className="mdscreen" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {/* hero */}
      <section
        className="md-hero-layout"
        style={{
          position: "relative",
          border: "var(--bw) solid var(--line)",
          borderRadius: "var(--radius)",
          background: "var(--panel)",
          boxShadow: "var(--shadow)",
          overflow: "hidden",
          padding: "56px 40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 90% at 88% 12%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            className="md-num"
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: ".06em",
              color: "var(--accent)",
              border: "var(--bw) solid var(--line)",
              borderRadius: 999,
              padding: "5px 12px",
              marginBottom: 18,
            }}
          >
            {L.heroKicker}
          </div>
          <h1
            className="md-head"
            style={{ fontSize: 52, lineHeight: 1.02, margin: "0 0 14px" }}
          >
            {L.heroTitle}
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 440, margin: "0 0 26px" }}>
            {L.heroSub}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/shop"
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                padding: "12px 22px",
                borderRadius: "var(--btnr)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {L.heroCta} →
            </Link>
            <Link
              href="/admin"
              style={{
                background: "var(--panel)",
                color: "var(--ink)",
                border: "var(--bw) solid var(--line)",
                padding: "12px 22px",
                borderRadius: "var(--btnr)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {L.heroCta2}
            </Link>
          </div>
          <div style={{ display: "flex", gap: 34, marginTop: 30 }}>
            {L.heroStats.map((s) => (
              <div key={s.num}>
                <div
                  className="md-num"
                  style={{ fontSize: 26, fontWeight: 600, color: "var(--ink)" }}
                >
                  {s.num}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: 999,
              background:
                "radial-gradient(circle,color-mix(in srgb,var(--accent) 22%,transparent),transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <Image
            src="/magicdojo-logo.png"
            alt="Magic Dojo"
            width={260}
            height={260}
            style={{
              position: "relative",
              objectFit: "contain",
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,.18))",
            }}
          />
        </div>
      </section>

      {/* value strip */}
      <section className="md-values-grid" style={{ marginTop: 14 }}>
        {L.valueProps.map((v) => (
          <div
            key={v.no}
            style={{
              border: "var(--bw) solid var(--line)",
              borderRadius: "var(--radius)",
              background: "var(--panel)",
              padding: "18px 20px",
            }}
          >
            <div
              className="md-num"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}
            >
              {v.no}
            </div>
            <div className="md-head" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              {v.title}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{v.desc}</div>
          </div>
        ))}
      </section>

      {/* featured */}
      <section style={{ marginTop: 44 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h2 className="md-head" style={{ fontSize: 27, margin: 0 }}>
            {L.featured}
          </h2>
          <Link
            href="/shop"
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--accent)",
              borderBottom: "1.5px solid var(--accent)",
              paddingBottom: 1,
            }}
          >
            {L.seeAll} →
          </Link>
        </div>
        <div className="md-featured-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
