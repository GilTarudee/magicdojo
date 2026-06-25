import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AuthClient from "@/components/AuthClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");
  return <AuthClient />;
}
