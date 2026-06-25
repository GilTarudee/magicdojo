import HomeClient from "@/components/HomeClient";
import { getFeatured } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, user] = await Promise.all([getFeatured(8), getCurrentUser()]);
  return <HomeClient featured={featured} isAdmin={!!user?.isAdmin} />;
}
