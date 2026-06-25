import HomeClient from "@/components/HomeClient";
import { getFeatured } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeatured(8);
  return <HomeClient featured={featured} />;
}
