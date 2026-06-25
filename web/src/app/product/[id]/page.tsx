import { notFound } from "next/navigation";
import ProductClient from "@/components/ProductClient";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProduct(Number(id));
  if (!p) notFound();
  return <ProductClient p={p} />;
}
