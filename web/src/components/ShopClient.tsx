"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  MANA,
  COLOR_CHIPS,
  colorKey,
  glyphFor,
  artBgFor,
  badgeFor,
  fmtBaht,
} from "@/lib/i18n";
import type { CardView } from "@/lib/products";

type Sort = "featured" | "priceLow" | "priceHigh" | "nameAZ";

function swatch(k: string): string | null {
  if (k === "all") return null;
  if (k === "M") return "#cda94e";
  if (k === "C") return "#c2bcad";
  return MANA[k]?.bg ?? "#cdc7b8";
}

export default function ShopClient({
  products,
  sets,
}: {
  products: CardView[];
  sets: { code: string; name: string }[];
}) {
  const { L, addToCart } = useStore();
  const [query, setQuery] = useState("");
  const [color, setColor] = useState<string>("all");
  const [setCode, setSetCode] = useState<string>("all");
  const [setSearch, setSetSearch] = useState("");
  const [setOpen, setSetOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");

  const sortOptions: { k: Sort; label: string }[] = [
    { k: "featured", label: L.sortFeatured },
    { k: "priceLow", label: L.sortLow },
    { k: "priceHigh", label: L.sortHigh },
    { k: "nameAZ", label: L.sortName },
  ];

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (setCode !== "all" && p.setCode !== setCode) return false;
      if (color !== "all" && colorKey(p.colors) !== color) return false;
      return true;
    });
    if (sort === "priceLow")
      r = [...r].sort((a, b) => (a.priceFromThb ?? 1e9) - (b.priceFromThb ?? 1e9));
    else if (sort === "priceHigh")
      r = [...r].sort((a, b) => (b.priceFromThb ?? 0) - (a.priceFromThb ?? 0));
    else if (sort === "nameAZ") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    else r = [...r].sort((a, b) => Number(b.featured) - Number(a.featured));
    return r;
  }, [products, query, color, setCode, sort]);

  const setSuggestions = useMemo(() => {
    const q = setSearch.trim().toLowerCase();
    const opts = [{ code: "all", name: L.allSets }, ...sets];
    return opts.filter(
      (o) => !q || o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q),
    );
  }, [sets, setSearch, L]);

  function reset() {
    setQuery("");
    setColor("all");
    setSetCode("all");
    setSetSearch("");
    setSort("featured");
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    fontWeight: 600,
    marginBottom: 9,
  };

  return (
    <main className="mdscreen" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 48px" }}>
      <h1 className="md-head" style={{ fontSize: 32, margin: "0 0 4px" }}>
        {L.shopTitle}
      </h1>
      <p style={{ color: "var(--muted)", margin: "0 0 22px", fontSize: 14 }}>
        {list.length} {L.results}
      </p>

      <div className="md-sidebar-layout">
        {/* filters */}
        <aside style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ position: "relative" }}>
            <svg
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={L.search}
              style={{
                width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)",
                background: "var(--panel)", padding: "11px 12px 11px 34px", fontSize: 14, color: "var(--ink)", outline: "none",
              }}
            />
          </div>

          <div>
            <div style={labelStyle}>{L.colors}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {COLOR_CHIPS.map((k) => {
                const active = color === k;
                const sw = swatch(k);
                return (
                  <button
                    key={k}
                    onClick={() => setColor(k)}
                    style={{
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                      border: active ? "none" : "var(--bw) solid var(--line)",
                      background: active ? "var(--accent)" : "var(--panel)",
                      color: active ? "var(--accentInk)" : "var(--ink)",
                      borderRadius: 999, padding: "5px 11px", fontSize: 12.5, fontWeight: 500,
                    }}
                  >
                    {sw && (
                      <span style={{ width: 11, height: 11, borderRadius: 999, background: sw, border: "1px solid rgba(0,0,0,.2)" }} />
                    )}
                    {k === "all" ? L.allWord : L.cn[k] ?? k}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 30 }}>
            <div style={labelStyle}>{L.set}</div>
            <div style={{ position: "relative" }}>
              <input
                value={setSearch}
                onChange={(e) => { setSetSearch(e.target.value); setSetOpen(true); }}
                onFocus={() => setSetOpen(true)}
                onBlur={() => setTimeout(() => setSetOpen(false), 150)}
                placeholder={L.searchSet}
                style={{
                  width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)",
                  background: "var(--panel)", padding: "10px 30px 10px 11px", fontSize: 13.5, color: "var(--ink)", outline: "none",
                }}
              />
              {setSearch && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); setSetCode("all"); setSetSearch(""); setSetOpen(false); }}
                  style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 4 }}
                >
                  ×
                </button>
              )}
              {setOpen && (
                <div
                  className="mdscroll"
                  style={{
                    position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, maxHeight: 240, overflow: "auto",
                    background: "var(--panel)", border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 4,
                  }}
                >
                  {setSuggestions.map((o) => (
                    <button
                      key={o.code}
                      onMouseDown={(e) => { e.preventDefault(); setSetCode(o.code); setSetSearch(o.code === "all" ? "" : o.name); setSetOpen(false); }}
                      style={{
                        cursor: "pointer", width: "100%", textAlign: "left", border: "none",
                        background: setCode === o.code ? "var(--panel2)" : "transparent",
                        color: "var(--ink)", borderRadius: "var(--btnr)", padding: "9px 11px", fontSize: 13.5,
                        display: "flex", alignItems: "center", gap: 9,
                      }}
                    >
                      <span className="md-num" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", minWidth: 34 }}>
                        {o.code === "all" ? "•" : o.code}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>{o.name}</span>
                    </button>
                  ))}
                  {setSuggestions.length === 0 && (
                    <div style={{ padding: 11, fontSize: 12.5, color: "var(--muted)" }}>{L.noResults}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={labelStyle}>{L.sort}</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              style={{ width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--panel)", padding: "10px 11px", fontSize: 13.5, color: "var(--ink)" }}
            >
              {sortOptions.map((o) => (
                <option key={o.k} value={o.k}>{o.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={reset}
            style={{ cursor: "pointer", border: "var(--bw) solid var(--line)", background: "transparent", color: "var(--muted)", borderRadius: "var(--btnr)", padding: 9, fontSize: 12.5, fontWeight: 500 }}
          >
            {L.reset}
          </button>
        </aside>

        {/* grid */}
        <div>
          {list.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
              {list.map((p) => (
                <ShopCard key={p.id} p={p} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div style={{ border: "var(--bw) dashed var(--line)", borderRadius: "var(--radius)", padding: 60, textAlign: "center", color: "var(--muted)" }}>
              {L.noResults}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ShopCard({ p, onAdd }: { p: CardView; onAdd: ReturnType<typeof useStore>["addToCart"] }) {
  const { L } = useStore();
  const ck = colorKey(p.colors);
  const badge = badgeFor(p.totalStock, L);
  const avail = p.variants.filter((v) => v.stock > 0);
  const first = avail[0];
  const rarityLabel = p.rarity ? L.rar[p.rarity] ?? p.rarity : "";

  return (
    <div style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", overflow: "hidden", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column" }}>
      <Link href={`/product/${p.id}`} style={{ position: "relative", aspectRatio: "5 / 7", background: artBgFor(ck), display: "block" }}>
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--headf)", fontWeight: 700, fontSize: 74, color: "rgba(255,255,255,.16)" }}>
            {glyphFor(ck)}
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,rgba(0,0,0,.3))" }} />
        <div style={{ position: "absolute", top: 9, right: 9, display: "flex", gap: 4 }}>
          {avail.map((v) => (
            <span key={v.finish} className="md-num" style={{ background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: ".03em", padding: "3px 6px", borderRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,.3)" }}>
              {v.finish === "foil" ? L.vFoil : L.vNonFoil}
            </span>
          ))}
        </div>
        <span style={{ position: "absolute", left: 9, top: 9, fontSize: 10.5, fontWeight: 600, letterSpacing: ".04em", padding: "3px 8px", borderRadius: 999, background: badge.bg, color: badge.fg, border: badge.border }}>
          {badge.text}
        </span>
      </Link>
      <div style={{ padding: "12px 13px 13px", display: "flex", flexDirection: "column", flex: 1 }}>
        <Link href={`/product/${p.id}`} className="md-head" style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.2, marginBottom: 3 }}>
          {p.name}
        </Link>
        <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 11 }}>
          {p.setName}{rarityLabel ? ` · ${rarityLabel}` : ""}
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            {p.priceFromThb != null && (
              <>
                <span style={{ fontSize: 10.5, color: "var(--muted)" }}>{L.from} </span>
                <span className="md-num" style={{ fontWeight: 600, fontSize: 15, color: "var(--accent)" }}>฿{fmtBaht(p.priceFromThb)}</span>
              </>
            )}
          </div>
          <button
            disabled={p.soldOut || !first}
            onClick={() =>
              first &&
              onAdd({
                productId: p.id, finish: first.finish, name: p.name, setCode: p.setCode, setName: p.setName,
                colors: p.colors, unitPriceThb: first.priceThb, imageUrl: p.imageUrl, maxStock: first.stock,
              })
            }
            style={{
              cursor: p.soldOut ? "not-allowed" : "pointer", border: "none",
              background: p.soldOut ? "var(--panel2)" : "var(--accent)",
              color: p.soldOut ? "var(--muted)" : "var(--accentInk)",
              borderRadius: "var(--btnr)", height: 32, padding: "0 12px", fontSize: 12.5, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {p.soldOut ? L.sold : L.addShort}
          </button>
        </div>
      </div>
    </div>
  );
}
