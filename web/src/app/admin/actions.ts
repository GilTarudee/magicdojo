"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { setSetting } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";
import type { Finish } from "@/lib/store";

const ORDER_STATUSES = ["pending", "paid", "shipped", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}

export async function saveShopSetting(key: "promptpayId" | "bankInfo", value: string) {
  await requireAdmin();
  await setSetting(key, value.trim());
  revalidatePath("/admin");
}

function clampInt(n: number): number {
  return Math.max(0, Math.round(Number.isFinite(n) ? n : 0));
}

export async function setStock(id: number, finish: Finish, value: number) {
  await requireAdmin();
  const v = clampInt(value);
  await prisma.product.update({
    where: { id },
    data: finish === "foil" ? { foilStock: v } : { stock: v },
  });
  revalidatePath("/admin");
  revalidatePath("/shop");
}

// Set the cost of goods (THB) for a finish. Pass null/empty to clear.
export async function setCost(id: number, finish: Finish, value: number | null) {
  await requireAdmin();
  const v = value == null || !Number.isFinite(value) ? null : Math.max(0, Math.round(value));
  await prisma.product.update({
    where: { id },
    data: finish === "foil" ? { foilCostThb: v } : { costThb: v },
  });
  revalidatePath("/admin");
}

export async function addExpense(input: { label: string; category: string; amountThb: number }) {
  await requireAdmin();
  const amount = Math.max(0, Math.round(Number(input.amountThb) || 0));
  if (!input.label?.trim() || amount <= 0) return;
  await prisma.expense.create({
    data: { label: input.label.trim(), category: input.category || "other", amountThb: amount },
  });
  revalidatePath("/admin/profit");
}

export async function deleteExpense(id: number) {
  await requireAdmin();
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/admin/profit");
}

// Set a manual THB price override for a finish. Pass null to clear (back to market).
export async function setPrice(id: number, finish: Finish, value: number | null) {
  await requireAdmin();
  const v = value == null || !Number.isFinite(value) ? null : Math.max(0, Math.round(value));
  await prisma.product.update({
    where: { id },
    data: finish === "foil" ? { foilPriceOverrideThb: v } : { priceOverrideThb: v },
  });
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function setFeatured(id: number, featured: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { featured } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function setFxRate(rate: number) {
  await requireAdmin();
  const v = Number.isFinite(rate) && rate > 0 ? rate : 36;
  await prisma.setting.upsert({
    where: { key: "fxRate" },
    update: { value: String(v) },
    create: { key: "fxRate", value: String(v) },
  });
  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath("/");
  return v;
}

// Clear every manual THB override → all prices follow market (USD × fx).
export async function resetMarketPrices() {
  await requireAdmin();
  await prisma.product.updateMany({
    data: { priceOverrideThb: null, foilPriceOverrideThb: null },
  });
  revalidatePath("/admin");
  revalidatePath("/shop");
}

// Fetch the latest USD→THB market rate from a free FX API and save it.
export async function fetchLatestRate(): Promise<number | null> {
  await requireAdmin();
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: { THB?: number } };
    const thb = data.rates?.THB;
    if (!thb || !Number.isFinite(thb)) return null;
    const rounded = Math.round(thb * 100) / 100;
    await setFxRate(rounded);
    return rounded;
  } catch {
    return null;
  }
}
