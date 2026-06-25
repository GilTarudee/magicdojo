import { prisma } from "@/lib/prisma";
import { roundBaht } from "@/lib/i18n";
import type { Finish } from "@/lib/store";

export const DEFAULT_FX = 36;

export async function getFx(): Promise<number> {
  const row = await prisma.setting.findUnique({ where: { key: "fxRate" } });
  const v = row ? Number(row.value) : NaN;
  return Number.isFinite(v) && v > 0 ? v : DEFAULT_FX;
}

export type VariantView = {
  finish: Finish;
  priceThb: number;
  stock: number;
  manual: boolean; // price was manually overridden
};

export type CardView = {
  id: number;
  name: string;
  setCode: string;
  setName: string;
  colors: string[];
  rarity: string | null; // single-letter: M | R | U | C
  typeLine: string | null;
  imageUrl: string | null;
  featured: boolean;
  variants: VariantView[];
  totalStock: number;
  priceFromThb: number | null; // cheapest in-stock (or any) variant
  soldOut: boolean;
};

type ProductRow = {
  id: number;
  name: string;
  setCode: string;
  setName: string;
  colors: string;
  rarity: string | null;
  typeLine: string | null;
  imageUrl: string | null;
  featured: boolean;
  priceUsd: number | null;
  foilPriceUsd: number | null;
  priceOverrideThb: number | null;
  foilPriceOverrideThb: number | null;
  stock: number;
  foilStock: number;
};

export function decorate(p: ProductRow, fx: number): CardView {
  const variants: VariantView[] = [];

  const nfThb = p.priceOverrideThb ?? (p.priceUsd != null ? roundBaht(p.priceUsd * fx) : null);
  if (nfThb != null) {
    variants.push({
      finish: "nonfoil",
      priceThb: nfThb,
      stock: p.stock,
      manual: p.priceOverrideThb != null,
    });
  }
  const fThb =
    p.foilPriceOverrideThb ?? (p.foilPriceUsd != null ? roundBaht(p.foilPriceUsd * fx) : null);
  if (fThb != null) {
    variants.push({
      finish: "foil",
      priceThb: fThb,
      stock: p.foilStock,
      manual: p.foilPriceOverrideThb != null,
    });
  }

  const inStock = variants.filter((v) => v.stock > 0);
  const totalStock = variants.reduce((s, v) => s + v.stock, 0);
  const pool = inStock.length ? inStock : variants;
  const priceFromThb = pool.length ? Math.min(...pool.map((v) => v.priceThb)) : null;

  return {
    id: p.id,
    name: p.name,
    setCode: p.setCode,
    setName: p.setName,
    colors: p.colors ? p.colors.split(",").filter(Boolean) : [],
    rarity: p.rarity,
    typeLine: p.typeLine,
    imageUrl: p.imageUrl,
    featured: p.featured,
    variants,
    totalStock,
    priceFromThb,
    soldOut: inStock.length === 0,
  };
}

export async function getFeatured(limit = 8): Promise<CardView[]> {
  const fx = await getFx();
  const rows = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  const use = rows.length
    ? rows
    : await prisma.product.findMany({ orderBy: { id: "asc" }, take: 4 });
  return use.map((r) => decorate(r, fx));
}

export async function getAllProducts(): Promise<CardView[]> {
  const fx = await getFx();
  const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => decorate(r, fx));
}

export async function getProduct(id: number): Promise<CardView | null> {
  const fx = await getFx();
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? decorate(row, fx) : null;
}

// ---- Admin views (always expose both finishes, incl. market reference price) ----

export type AdminVariant = {
  finish: Finish;
  priceThb: number; // currently effective (override ?? market ?? 0)
  marketThb: number | null; // USD × fx, rounded (null if no USD price known)
  stock: number;
  manual: boolean; // a THB override is set
};

export type AdminCard = {
  id: number;
  name: string;
  setCode: string;
  setName: string;
  colors: string[];
  rarity: string | null;
  imageUrl: string | null;
  featured: boolean;
  totalStock: number;
  variants: AdminVariant[];
};

export type AdminData = {
  products: AdminCard[];
  fx: number;
  sets: { code: string; name: string }[];
  stats: { skus: number; totalStock: number; lowStock: number };
};

export async function getAdminData(): Promise<AdminData> {
  const fx = await getFx();
  const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });

  const products: AdminCard[] = rows.map((p) => {
    const nfMarket = p.priceUsd != null ? roundBaht(p.priceUsd * fx) : null;
    const fMarket = p.foilPriceUsd != null ? roundBaht(p.foilPriceUsd * fx) : null;
    const variants: AdminVariant[] = [
      {
        finish: "nonfoil",
        priceThb: p.priceOverrideThb ?? nfMarket ?? 0,
        marketThb: nfMarket,
        stock: p.stock,
        manual: p.priceOverrideThb != null,
      },
      {
        finish: "foil",
        priceThb: p.foilPriceOverrideThb ?? fMarket ?? 0,
        marketThb: fMarket,
        stock: p.foilStock,
        manual: p.foilPriceOverrideThb != null,
      },
    ];
    return {
      id: p.id,
      name: p.name,
      setCode: p.setCode,
      setName: p.setName,
      colors: p.colors ? p.colors.split(",").filter(Boolean) : [],
      rarity: p.rarity,
      imageUrl: p.imageUrl,
      featured: p.featured,
      totalStock: p.stock + p.foilStock,
      variants,
    };
  });

  const totalStock = products.reduce((s, p) => s + p.totalStock, 0);
  const lowStock = products.filter((p) => p.totalStock > 0 && p.totalStock <= 3).length;

  const setMap = new Map<string, string>();
  rows.forEach((r) => setMap.set(r.setCode, r.setName));
  const sets = [...setMap.entries()]
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    products,
    fx,
    sets,
    stats: { skus: products.length, totalStock, lowStock },
  };
}

export async function getSets(): Promise<{ code: string; name: string }[]> {
  const rows = await prisma.product.findMany({
    distinct: ["setCode"],
    select: { setCode: true, setName: true },
    orderBy: { setName: "asc" },
  });
  return rows.map((r) => ({ code: r.setCode, name: r.setName }));
}
