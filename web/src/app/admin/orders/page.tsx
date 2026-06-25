import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import OrdersClient from "@/components/OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) redirect("/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <OrdersClient
      orders={orders.map((o) => ({
        id: o.id,
        createdAt: o.createdAt.toISOString(),
        customerName: o.customerName,
        phone: o.phone ?? "",
        email: o.email ?? "",
        address: o.address ?? "",
        note: o.note ?? "",
        payMethod: o.payMethod,
        status: o.status,
        totalThb: o.totalThb,
        items: o.items.map((i) => ({
          name: i.name,
          finish: i.finish,
          qty: i.qty,
          unitPriceThb: i.unitPriceThb,
        })),
      }))}
    />
  );
}
