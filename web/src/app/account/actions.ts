"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthResult> {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password ?? "";
  if (!name || !email || !password) return { ok: false, error: "missing" };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "email" };
  if (password.length < 6) return { ok: false, error: "short" };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "exists" };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      phone: input.phone?.trim() || null,
    },
  });
  await createSession(user.id);
  revalidatePath("/");
  return { ok: true };
}

export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const email = input.email?.trim().toLowerCase();
  const password = input.password ?? "";
  if (!email || !password) return { ok: false, error: "missing" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, error: "invalid" };
  }
  await createSession(user.id);
  revalidatePath("/");
  return { ok: true };
}

export async function logout(): Promise<void> {
  await destroySession();
  revalidatePath("/");
}
