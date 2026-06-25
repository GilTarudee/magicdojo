import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    user ? { user: { name: user.name, isAdmin: user.isAdmin } } : { user: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
