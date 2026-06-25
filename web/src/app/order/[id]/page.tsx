import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { promptpayQrDataUrl } from "@/lib/promptpay";
import OrderConfirmClient from "@/components/OrderConfirmClient";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const bankInfo = await getSetting("bankInfo");
  const qr =
    order.payMethod === "promptpay" ? await promptpayQrDataUrl(order.totalThb) : null;

  return (
    <OrderConfirmClient
      pay={{
        method: order.payMethod,
        bankInfo,
        qrDataUrl: qr?.dataUrl ?? null,
        promptpayId: qr?.id ?? null,
      }}
      order={{
        id: order.id,
        customerName: order.customerName,
        payMethod: order.payMethod,
        status: order.status,
        subtotalThb: order.subtotalThb,
        shippingThb: order.shippingThb,
        totalThb: order.totalThb,
        items: order.items.map((i) => ({
          name: i.name,
          setCode: i.setCode,
          finish: i.finish,
          unitPriceThb: i.unitPriceThb,
          qty: i.qty,
        })),
      }}
    />
  );
}
