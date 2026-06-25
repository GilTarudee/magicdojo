import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClient from "@/components/AccountClient";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <AccountClient
      user={{ name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin }}
      orders={orders.map((o) => ({
        id: o.id,
        createdAt: o.createdAt.toISOString(),
        status: o.status,
        totalThb: o.totalThb,
        itemCount: o.items.reduce((s, i) => s + i.qty, 0),
      }))}
    />
  );
}
