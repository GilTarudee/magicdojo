import { redirect } from "next/navigation";
import AdminClient from "@/components/AdminClient";
import { getAdminData } from "@/lib/products";
import { getSetting } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) redirect("/login");

  const [data, promptpayId, bankInfo] = await Promise.all([
    getAdminData(),
    getSetting("promptpayId"),
    getSetting("bankInfo"),
  ]);
  return <AdminClient data={data} promptpayId={promptpayId} bankInfo={bankInfo} />;
}
