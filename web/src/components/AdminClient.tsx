"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { MANA, COLOR_CHIPS, colorKey, glyphFor, artBgFor, badgeFor } from "@/lib/i18n";
import type { AdminData, AdminCard } from "@/lib/products";
import {
  setStock,
  setPrice,
  setCost,
  setFeatured,
  setFxRate,
  resetMarketPrices,
  fetchLatestRate,
  saveShopSetting,
} from "@/app/admin/actions";

type Sort = "featured" | "priceLow" | "priceHigh" | "nameAZ";
const PER = 12;

function swatch(k: string): string | null {
  if (k === "all") return null;
  if (k === "M") return "#cda94e";
  if (k === "C") return "#c2bcad";
  return MANA[k]?.bg ?? "#cdc7b8";
}

export default function AdminClient({
  data,
  promptpayId,
  bankInfo,
}: {
  data: AdminData;
  promptpayId: string;
  bankInfo: string;
}) {
  const { L, showToast } = useStore();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [pp, setPp] = useState(promptpayId);
  const [bank, setBank] = useState(bankInfo);
  const [rate, setRate] = useState(String(data.fx));
  const [query, setQuery] = useState("");
  const [color, setColor] = useState("all");
  const [setCode, setSetCode] = useState("all");
  const [setSearch, setSetSearch] = useState("");
  const [setOpen, setSetOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(0);

  const sortOptions: { k: Sort; label: string }[] = [
    { k: "featured", label: L.sortFeatured },
    { k: "priceLow", label: L.sortLow },
    { k: "priceHigh", label: L.sortHigh },
    { k: "nameAZ", label: L.sortName },
  ];

  const stats = [
    { num: data.stats.skus, label: L.stTitles[0], color: "var(--ink)" },
    { num: data.stats.totalStock, label: L.stTitles[1], color: "var(--ink)" },
    { num: data.stats.lowStock, label: L.stTitles[2], color: "var(--accent)" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = data.products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (setCode !== "all" && p.setCode !== setCode) return false;
      if (color !== "all" && colorKey(p.colors) !== color) return false;
      return true;
    });
    const price = (p: AdminCard) => Math.min(...p.variants.map((v) => v.priceThb || 1e9));
    if (sort === "priceLow") r = [...r].sort((a, b) => price(a) - price(b));
    else if (sort === "priceHigh") r = [...r].sort((a, b) => price(b) - price(a));
    else if (sort === "nameAZ") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    else r = [...r].sort((a, b) => Number(b.featured) - Number(a.featured));
    return r;
  }, [data.products, query, color, setCode, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const cur = Math.min(page, pages - 1);
  const start = cur * PER;
  const pageItems = filtered.slice(start, start + PER);
  const rangeLabel =
    filtered.length === 0
      ? ""
      : `${L.showing} ${start + 1}–${Math.min(start + PER, filtered.length)} ${L.ofWord} ${filtered.length} ${L.cardsWord}`;

  const setSuggestions = useMemo(() => {
    const q = setSearch.trim().toLowerCase();
    const opts = [{ code: "all", name: L.allSets }, ...data.sets];
    return opts.filter((o) => !q || o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q));
  }, [data.sets, setSearch, L]);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function commitRate() {
    const v = Number(rate);
    const saved = await setFxRate(v);
    setRate(String(saved));
    showToast(L.rateUpdated);
    refresh();
  }

  async function doFetchRate() {
    const v = await fetchLatestRate();
    if (v != null) {
      setRate(String(v));
      showToast(L.rateUpdated);
      refresh();
    }
  }

  async function doResetMarket() {
    await resetMarketPrices();
    showToast(L.marketReset);
    refresh();
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 9,
  };

  return (
    <main className="mdscreen" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 48px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h1 className="md-head" style={{ fontSize: 32, margin: "0 0 4px" }}>{L.adminTitle}</h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>{L.adminSub}</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
          <Link href="/admin/orders" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, border: "var(--bw) solid var(--accent)", borderRadius: "var(--radius)", background: "transparent", color: "var(--accent)", padding: "12px 18px", fontWeight: 600, fontSize: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {L.manageOrders}
            </span>
          </Link>
          <Link href="/admin/profit" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, border: "var(--bw) solid var(--accent)", borderRadius: "var(--radius)", background: "transparent", color: "var(--accent)", padding: "12px 18px", fontWeight: 600, fontSize: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
              {L.viewProfit}
            </span>
          </Link>
          {stats.map((st, i) => (
            <div key={i} style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: "12px 18px", minWidth: 104 }}>
              <div className="md-num" style={{ fontWeight: 600, fontSize: 24, color: st.color }}>{st.num}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".04em" }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* exchange rate panel */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 2 }}>{L.rateTitle}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", maxWidth: 360 }}>{L.rateNote}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="md-num" style={{ fontSize: 15, color: "var(--muted)" }}>฿</span>
            <input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              onBlur={commitRate}
              inputMode="decimal"
              className="md-num"
              style={{ width: 80, border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "8px 10px", fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "right" }}
            />
            <span className="md-num" style={{ fontSize: 13, color: "var(--muted)" }}>{L.perDollar}</span>
            <button onClick={doFetchRate} style={{ cursor: "pointer", border: "var(--bw) solid var(--accent)", background: "transparent", color: "var(--accent)", borderRadius: "var(--btnr)", padding: "8px 13px", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>↻ {L.fetchRate}</button>
          </div>
        </div>
        <button onClick={doResetMarket} style={{ cursor: "pointer", border: "var(--bw) solid var(--line)", background: "transparent", color: "var(--muted)", borderRadius: "var(--btnr)", padding: "8px 14px", fontSize: 12.5, fontWeight: 600 }}>{L.resetMarket}</button>
      </div>

      {/* shop settings panel */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 20, border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, alignSelf: "center" }}>{L.shopSettings}</div>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 5 }}>{L.fldPromptpay}</label>
          <input value={pp} onChange={(e) => setPp(e.target.value)} onBlur={async () => { await saveShopSetting("promptpayId", pp); showToast(L.saved); }} inputMode="tel"
            className="md-num" style={{ width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "8px 10px", fontSize: 14, color: "var(--ink)" }} placeholder="08XXXXXXXX" />
        </div>
        <div style={{ flex: "2 1 280px" }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 5 }}>{L.fldBank}</label>
          <input value={bank} onChange={(e) => setBank(e.target.value)} onBlur={async () => { await saveShopSetting("bankInfo", bank); showToast(L.saved); }}
            style={{ width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "8px 10px", fontSize: 14, color: "var(--ink)" }} placeholder="ธนาคาร ... เลขบัญชี ... ชื่อบัญชี ..." />
        </div>
      </div>

      <div className="md-sidebar-layout">
        {/* sidebar */}
        <aside style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder={L.searchName}
              style={{ width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--panel)", padding: "11px 12px 11px 34px", fontSize: 14, color: "var(--ink)", outline: "none" }} />
          </div>

          <div>
            <div style={labelStyle}>{L.colors}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {COLOR_CHIPS.map((k) => {
                const active = color === k;
                const sw = swatch(k);
                return (
                  <button key={k} onClick={() => { setColor(k); setPage(0); }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, border: active ? "none" : "var(--bw) solid var(--line)", background: active ? "var(--accent)" : "var(--panel)", color: active ? "var(--accentInk)" : "var(--ink)", borderRadius: 999, padding: "5px 11px", fontSize: 12.5, fontWeight: 500 }}>
                    {sw && <span style={{ width: 11, height: 11, borderRadius: 999, background: sw, border: "1px solid rgba(0,0,0,.2)" }} />}
                    {k === "all" ? L.allWord : L.cn[k] ?? k}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 30 }}>
            <div style={labelStyle}>{L.set}</div>
            <div style={{ position: "relative" }}>
              <input value={setSearch} onChange={(e) => { setSetSearch(e.target.value); setSetOpen(true); }} onFocus={() => setSetOpen(true)} onBlur={() => setTimeout(() => setSetOpen(false), 150)} placeholder={L.searchSet}
                style={{ width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--panel)", padding: "10px 30px 10px 11px", fontSize: 13.5, color: "var(--ink)", outline: "none" }} />
              {setSearch && (
                <button onMouseDown={(e) => { e.preventDefault(); setSetCode("all"); setSetSearch(""); setSetOpen(false); setPage(0); }}
                  style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 4 }}>×</button>
              )}
              {setOpen && (
                <div className="mdscroll" style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0, maxHeight: 260, overflow: "auto", background: "var(--panel)", border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 4, zIndex: 40 }}>
                  {setSuggestions.map((o) => (
                    <button key={o.code} onMouseDown={(e) => { e.preventDefault(); setSetCode(o.code); setSetSearch(o.code === "all" ? "" : o.name); setSetOpen(false); setPage(0); }}
                      style={{ cursor: "pointer", width: "100%", textAlign: "left", border: "none", background: setCode === o.code ? "var(--panel2)" : "transparent", color: "var(--ink)", borderRadius: "var(--btnr)", padding: "9px 11px", fontSize: 13.5, display: "flex", alignItems: "center", gap: 9 }}>
                      <span className="md-num" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", minWidth: 34 }}>{o.code === "all" ? "•" : o.code}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>{o.name}</span>
                    </button>
                  ))}
                  {setSuggestions.length === 0 && <div style={{ padding: 11, fontSize: 12.5, color: "var(--muted)" }}>{L.noResults}</div>}
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={labelStyle}>{L.sort}</div>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              style={{ width: "100%", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--panel)", padding: "10px 11px", fontSize: 13.5, color: "var(--ink)" }}>
              {sortOptions.map((o) => <option key={o.k} value={o.k}>{o.label}</option>)}
            </select>
          </div>
        </aside>

        {/* grid */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{rangeLabel}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{L.adminNote}</span>
          </div>

          {filtered.length > 0 ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
                {pageItems.map((c) => <AdminCardTile key={c.id} c={c} onRefresh={refresh} />)}
              </div>
              {pages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 26, flexWrap: "wrap" }}>
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={cur <= 0}
                    style={{ cursor: cur <= 0 ? "not-allowed" : "pointer", border: "var(--bw) solid var(--line)", background: "var(--panel)", color: cur <= 0 ? "var(--muted)" : "var(--ink)", borderRadius: "var(--btnr)", height: 34, padding: "0 13px", fontSize: 13, fontWeight: 600 }}>‹ {L.pagePrev}</button>
                  {Array.from({ length: pages }, (_, n) => (
                    <button key={n} onClick={() => setPage(n)} className="md-num"
                      style={{ cursor: "pointer", border: n === cur ? "none" : "var(--bw) solid var(--line)", background: n === cur ? "var(--accent)" : "var(--panel)", color: n === cur ? "var(--accentInk)" : "var(--ink)", borderRadius: "var(--btnr)", minWidth: 34, height: 34, padding: "0 10px", fontSize: 13, fontWeight: 600 }}>{n + 1}</button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={cur >= pages - 1}
                    style={{ cursor: cur >= pages - 1 ? "not-allowed" : "pointer", border: "var(--bw) solid var(--line)", background: "var(--panel)", color: cur >= pages - 1 ? "var(--muted)" : "var(--ink)", borderRadius: "var(--btnr)", height: 34, padding: "0 13px", fontSize: 13, fontWeight: 600 }}>{L.pageNext} ›</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ border: "var(--bw) dashed var(--line)", borderRadius: "var(--radius)", padding: 60, textAlign: "center", color: "var(--muted)" }}>{L.noResults}</div>
          )}
        </div>
      </div>
    </main>
  );
}

function AdminCardTile({ c, onRefresh }: { c: AdminCard; onRefresh: () => void }) {
  const { L, showToast } = useStore();
  const ck = colorKey(c.colors);
  const badge = badgeFor(c.totalStock, L);
  const [feat, setFeat] = useState(c.featured);
  const rarityLabel = c.rarity ? L.rar[c.rarity] ?? c.rarity : "";

  async function toggleFeat() {
    const next = !feat;
    setFeat(next);
    await setFeatured(c.id, next);
    showToast(next ? L.featOn : L.featAdd);
  }

  return (
    <div style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", overflow: "hidden", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", aspectRatio: "5 / 7", background: artBgFor(ck) }}>
        {c.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.imageUrl} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--headf)", fontWeight: 700, fontSize: 44, color: "rgba(255,255,255,.16)" }}>{glyphFor(ck)}</div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,rgba(0,0,0,.3))" }} />
        <span className="md-num" style={{ position: "absolute", left: 9, top: 9, fontSize: 10, fontWeight: 600, letterSpacing: ".04em", color: "rgba(255,255,255,.85)", background: "rgba(0,0,0,.4)", padding: "2px 6px", borderRadius: 4 }}>{c.setCode}</span>
        {c.rarity && (
          <span className="md-num" style={{ position: "absolute", right: 9, top: 9, width: 22, height: 22, borderRadius: 999, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.rarity}</span>
        )}
        <button onClick={toggleFeat} title={feat ? L.featOn : L.featAdd}
          style={{ position: "absolute", right: 9, bottom: 9, cursor: "pointer", border: feat ? "none" : "var(--bw) solid var(--line)", background: feat ? "var(--accent)" : "rgba(0,0,0,.35)", color: feat ? "var(--accentInk)" : "#fff", borderRadius: 999, height: 26, padding: "0 10px", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={feat ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {feat ? L.featOn : L.featAdd}
        </button>
        <span style={{ position: "absolute", left: 9, bottom: 9, fontSize: 10, fontWeight: 600, letterSpacing: ".04em", padding: "3px 8px", borderRadius: 999, background: badge.bg, color: badge.fg, border: badge.border }}>{badge.text}</span>
      </div>

      <div style={{ padding: "11px 12px 12px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
        <div>
          <div className="md-head" style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2, minHeight: 34 }}>{c.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.setName}{rarityLabel ? ` · ${rarityLabel}` : ""}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
          {c.variants.map((v) => (
            <VariantEditor key={v.finish} productId={c.id} v={v} onRefresh={onRefresh} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VariantEditor({
  productId,
  v,
  onRefresh,
}: {
  productId: number;
  v: AdminCard["variants"][number];
  onRefresh: () => void;
}) {
  const { L } = useStore();
  const [price, setPriceVal] = useState(String(v.priceThb));
  const [stock, setStockVal] = useState(String(v.stock));
  const [cost, setCostVal] = useState(v.costThb != null ? String(v.costThb) : "");
  const [manual, setManual] = useState(v.manual);

  const lowStock = v.stock > 0 && v.stock <= 3;
  const costNum = cost.trim() === "" ? null : Number(cost);
  const margin = costNum != null && Number.isFinite(costNum) ? Number(price) - costNum : null;
  const marginPct = margin != null && Number(price) > 0 ? Math.round((margin / Number(price)) * 100) : null;

  async function commitCost() {
    if (cost.trim() === "") { await setCost(productId, v.finish, null); onRefresh(); return; }
    const n = Number(cost);
    if (!Number.isFinite(n)) { setCostVal(v.costThb != null ? String(v.costThb) : ""); return; }
    await setCost(productId, v.finish, n);
    onRefresh();
  }

  async function commitPrice() {
    const n = Number(price);
    if (!Number.isFinite(n)) { setPriceVal(String(v.priceThb)); return; }
    // typing the market price clears the override; any other value sets one
    const isMarket = v.marketThb != null && Math.round(n) === v.marketThb;
    await setPrice(productId, v.finish, isMarket ? null : n);
    setManual(!isMarket);
    onRefresh();
  }

  async function commitStock() {
    const n = Math.max(0, Math.round(Number(stock) || 0));
    setStockVal(String(n));
    await setStock(productId, v.finish, n);
    onRefresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 54, fontSize: 11, fontWeight: 600, color: "var(--ink)", flex: "none" }}>
          {v.finish === "foil" ? L.vFoil : L.vNonFoil}
          {manual ? <span style={{ color: "var(--accent)" }}> *</span> : null}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>฿</span>
          <input type="number" min={0} value={price} onChange={(e) => setPriceVal(e.target.value)} onBlur={commitPrice}
            className="md-num" style={{ width: 58, border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "5px 6px", fontSize: 12, color: "var(--ink)", textAlign: "right" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>×</span>
          <input type="number" min={0} value={stock} onChange={(e) => setStockVal(e.target.value)} onBlur={commitStock}
            className="md-num" style={{ width: 44, border: `var(--bw) solid ${lowStock ? "var(--accent)" : "var(--line)"}`, borderRadius: "var(--btnr)", background: "var(--bg)", padding: "5px 6px", fontSize: 12, color: lowStock ? "var(--accent)" : "var(--ink)", textAlign: "right", fontWeight: 600 }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 54 }}>
        <span style={{ fontSize: 9.5, color: "var(--muted)", flex: "none" }}>{L.costLabel}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 9.5, color: "var(--muted)" }}>฿</span>
          <input type="number" min={0} value={cost} onChange={(e) => setCostVal(e.target.value)} onBlur={commitCost} placeholder="—"
            className="md-num" style={{ width: 50, border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "3px 5px", fontSize: 11, color: "var(--ink)", textAlign: "right" }} />
        </div>
        {margin != null && (
          <span className="md-num" style={{ fontSize: 9.5, marginLeft: "auto", fontWeight: 600, color: margin >= 0 ? "#1f8f4f" : "var(--accent)" }}>
            {L.marginLabel} ฿{margin}{marginPct != null ? ` (${marginPct}%)` : ""}
          </span>
        )}
      </div>
      <div className="md-num" style={{ fontSize: 9, color: "var(--muted)", paddingLeft: 54 }}>
        {L.marketShort} {v.marketThb != null ? `฿${v.marketThb}` : "—"}
      </div>
    </div>
  );
}
