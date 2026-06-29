import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfitReport } from "@/lib/products";
import ProfitClient from "@/components/ProfitClient";

export const dynamic = "force-dynamic";

type Period = "month" | "30d" | "year";

function range(period: Period): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date(to);
  if (period === "30d") from.setDate(from.getDate() - 30);
  else if (period === "year") from.setMonth(0, 1), from.setHours(0, 0, 0, 0);
  else from.setDate(1), from.setHours(0, 0, 0, 0); // this month
  return { from, to };
}

export default async function ProfitPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) redirect("/login");

  const sp = await searchParams;
  const period: Period = sp.period === "30d" || sp.period === "year" ? sp.period : "month";
  const { from, to } = range(period);
  const report = await getProfitReport(from.toISOString(), to.toISOString());

  return <ProfitClient report={report} period={period} />;
}
