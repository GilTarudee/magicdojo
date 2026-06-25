import ShopClient from "@/components/ShopClient";
import { getAllProducts, getSets } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, sets] = await Promise.all([getAllProducts(), getSets()]);
  return <ShopClient products={products} sets={sets} />;
}
