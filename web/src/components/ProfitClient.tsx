"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { fmtBaht } from "@/lib/i18n";
import type { ProfitReport } from "@/lib/products";
import { addExpense, deleteExpense } from "@/app/admin/actions";

export default function ProfitClient({
  report,
  period,
}: {
  report: ProfitReport;
  period: "month" | "30d" | "year";
}) {
  const { L, lang } = useStore();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");

  const periods: { k: typeof period; label: string }[] = [
    { k: "month", label: L.thisMonth },
    { k: "30d", label: L.last30 },
    { k: "year", label: L.thisYear },
  ];

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function submitExpense(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!label.trim() || !Number.isFinite(amt) || amt <= 0) return;
    await addExpense({ label, category, amountThb: amt });
    setLabel("");
    setAmount("");
    refresh();
  }

  const rows: { label: string; value: number; strong?: boolean; sign?: boolean }[] = [
    { label: L.revenue, value: report.revenue },
    { label: `− ${L.cogs}`, value: -report.cogs },
    { label: L.grossProfit, value: report.grossProfit, strong: true },
    { label: `− ${L.opExpenses}`, value: -report.expenses },
  ];

  return (
    <main className="mdscreen" style={{ maxWidth: 760, margin: "0 auto", padding: "28px 24px 48px" }}>
      <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13.5, fontWeight: 500, marginBottom: 16 }}>← {L.backToAdmin}</Link>
      <h1 className="md-head" style={{ fontSize: 32, margin: "0 0 4px" }}>{L.profitTitle}</h1>
      <p style={{ color: "var(--muted)", margin: "0 0 20px", fontSize: 14 }}>{L.profitSub}</p>

      {/* period switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {periods.map((p) => (
          <Link key={p.k} href={`/admin/profit?period=${p.k}`}
            style={{ border: "var(--bw) solid var(--line)", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, background: period === p.k ? "var(--accent)" : "var(--panel)", color: period === p.k ? "var(--accentInk)" : "var(--ink)" }}>
            {p.label}
          </Link>
        ))}
      </div>

      {/* P&L summary */}
      <div style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", boxShadow: "var(--shadow)", padding: 22, marginBottom: 14 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderTop: i === 0 ? "none" : "var(--bw) solid var(--line)" }}>
            <span style={{ fontSize: r.strong ? 15 : 14, fontWeight: r.strong ? 600 : 400, color: r.strong ? "var(--ink)" : "var(--muted)" }}>{r.label}</span>
            <span className="md-num" style={{ fontSize: r.strong ? 17 : 15, fontWeight: r.strong ? 600 : 500 }}>
              {r.value < 0 ? "−" : ""}฿{fmtBaht(Math.abs(r.value))}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10, paddingTop: 14, borderTop: "2px solid var(--ink)" }}>
          <span style={{ fontWeight: 700, fontSize: 17 }}>{L.netProfit}</span>
          <span className="md-num" style={{ fontWeight: 700, fontSize: 26, color: report.netProfit >= 0 ? "#1f8f4f" : "var(--accent)" }}>
            {report.netProfit < 0 ? "−" : ""}฿{fmtBaht(Math.abs(report.netProfit))}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>{L.ordersCounted}: {report.orderCount}</div>
      </div>

      {/* expenses */}
      <div style={{ border: "var(--bw) solid var(--line)", borderRadius: "var(--radius)", background: "var(--panel)", padding: 20 }}>
        <div className="md-head" style={{ fontSize: 16, marginBottom: 12 }}>{L.expensesTitle}</div>

        <form onSubmit={submitExpense} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={L.expLabel}
            style={{ flex: "2 1 160px", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "8px 10px", fontSize: 13, color: "var(--ink)" }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            style={{ flex: "1 1 90px", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "8px 10px", fontSize: 13, color: "var(--ink)" }}>
            <option value="hosting">hosting</option>
            <option value="fees">fees</option>
            <option value="shipping">shipping</option>
            <option value="rent">rent</option>
            <option value="other">other</option>
          </select>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={0} placeholder={L.expAmount}
            className="md-num" style={{ flex: "1 1 90px", border: "var(--bw) solid var(--line)", borderRadius: "var(--btnr)", background: "var(--bg)", padding: "8px 10px", fontSize: 13, color: "var(--ink)", textAlign: "right" }} />
          <button type="submit" className="md-head" style={{ border: "none", background: "var(--accent)", color: "var(--accentInk)", borderRadius: "var(--btnr)", padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + {L.addExpense}
          </button>
        </form>

        {report.expenseList.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)", padding: "8px 0" }}>{L.noExpenses}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {report.expenseList.map((e) => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, borderTop: "var(--bw) solid var(--line)", paddingTop: 6 }}>
                <span style={{ color: "var(--muted)", flex: "none", width: 76 }} className="md-num">
                  {new Date(e.date).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "2-digit", month: "short" })}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>{e.label} <span style={{ color: "var(--muted)", fontSize: 11 }}>· {e.category}</span></span>
                <span className="md-num" style={{ fontWeight: 600 }}>฿{fmtBaht(e.amountThb)}</span>
                <button onClick={() => startTransition(async () => { await deleteExpense(e.id); router.refresh(); })}
                  title={L.remove} style={{ border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer", flex: "none", padding: 2, fontSize: 16, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
