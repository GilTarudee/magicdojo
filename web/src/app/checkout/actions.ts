"use server";

import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getFx } from "@/lib/products";
import { roundBaht, shippingFor } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CheckoutItem = { productId: number; finish: "nonfoil" | "foil"; qty: number };

export type CheckoutInput = {
  items: CheckoutItem[];
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
  payMethod: "transfer" | "promptpay";
};

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: "empty" | "name" | "stock" | "generic"; issues?: string[] };

export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  try {
    if (!input.items?.length) return { ok: false, error: "empty" };
    if (!input.customerName?.trim() || !input.phone?.trim()) return { ok: false, error: "name" };

    const fx = await getFx();
    const ids = [...new Set(input.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const map = new Map(products.map((p) => [p.id, p]));

    const lines: {
      productId: number;
      name: string;
      setCode: string;
      finish: "nonfoil" | "foil";
      unitPriceThb: number;
      unitCostThb: number;
      qty: number;
    }[] = [];
    const issues: string[] = [];

    for (const it of input.items) {
      const p = map.get(it.productId);
      if (!p) continue;
      const qty = Math.max(1, Math.floor(it.qty));
      const avail = it.finish === "foil" ? p.foilStock : p.stock;
      if (qty > avail) {
        issues.push(`${p.name} (${it.finish})`);
        continue;
      }
      const usd = it.finish === "foil" ? p.foilPriceUsd : p.priceUsd;
      const override = it.finish === "foil" ? p.foilPriceOverrideThb : p.priceOverrideThb;
      const unit = override ?? (usd != null ? roundBaht(usd * fx) : 0);
      const cost = (it.finish === "foil" ? p.foilCostThb : p.costThb) ?? 0;
      lines.push({
        productId: p.id,
        name: p.name,
        setCode: p.setCode,
        finish: it.finish,
        unitPriceThb: unit,
        unitCostThb: cost,
        qty,
      });
    }

    if (issues.length) return { ok: false, error: "stock", issues };
    if (!lines.length) return { ok: false, error: "empty" };

    const subtotal = lines.reduce((s, l) => s + l.unitPriceThb * l.qty, 0);
    const shipping = shippingFor(subtotal);
    const total = subtotal + shipping;
    const orderId = "MD-" + randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
    const currentUser = await getCurrentUser();

    await prisma.$transaction([
      prisma.order.create({
        data: {
          id: orderId,
          userId: currentUser?.id ?? null,
          customerName: input.customerName.trim(),
          phone: input.phone.trim(),
          email: input.email?.trim() || null,
          address: input.address?.trim() || null,
          note: input.note?.trim() || null,
          payMethod: input.payMethod,
          subtotalThb: subtotal,
          shippingThb: shipping,
          totalThb: total,
          status: "pending",
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              setCode: l.setCode,
              finish: l.finish,
              unitPriceThb: l.unitPriceThb,
              unitCostThb: l.unitCostThb,
              qty: l.qty,
            })),
          },
        },
      }),
      ...lines.map((l) =>
        prisma.product.update({
          where: { id: l.productId },
          data:
            l.finish === "foil"
              ? { foilStock: { decrement: l.qty } }
              : { stock: { decrement: l.qty } },
        }),
      ),
    ]);

    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin");
    return { ok: true, orderId };
  } catch (e) {
    console.error("placeOrder failed", e);
    return { ok: false, error: "generic" };
  }
}
