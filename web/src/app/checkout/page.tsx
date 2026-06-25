import CheckoutClient from "@/components/CheckoutClient";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  return (
    <CheckoutClient
      initial={{
        name: user?.name ?? "",
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        address: user?.address ?? "",
      }}
    />
  );
}
