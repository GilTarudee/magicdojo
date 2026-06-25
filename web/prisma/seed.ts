import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Curated singles for the shop. setHint picks a specific printing when useful.
const SEED: {
  name: string;
  setHint?: string;
  stock: number;
  foilStock: number;
  featured?: boolean;
}[] = [
  { name: "Lightning Bolt", stock: 8, foilStock: 3, featured: true },
  { name: "Counterspell", stock: 10, foilStock: 2 },
  { name: "Sol Ring", stock: 12, foilStock: 3, featured: true },
  { name: "Llanowar Elves", stock: 15, foilStock: 4 },
  { name: "Swords to Plowshares", stock: 6, foilStock: 2, featured: true },
  { name: "Dark Ritual", stock: 9, foilStock: 2 },
  { name: "Brainstorm", stock: 11, foilStock: 3 },
  { name: "Birds of Paradise", stock: 4, foilStock: 1, featured: true },
  { name: "Ragavan, Nimble Pilferer", stock: 3, foilStock: 1, featured: true },
  { name: "Orcish Bowmasters", stock: 2, foilStock: 1, featured: true },
  { name: "Wrath of God", stock: 5, foilStock: 1 },
  { name: "Cultivate", stock: 20, foilStock: 1 },
  { name: "Fatal Push", stock: 14, foilStock: 3 },
  { name: "Path to Exile", stock: 9, foilStock: 2 },
  { name: "Thoughtseize", stock: 7, foilStock: 2, featured: true },
  { name: "Cyclonic Rift", stock: 5, foilStock: 1 },
  { name: "Teferi, Hero of Dominaria", stock: 3, foilStock: 1 },
  { name: "Snapcaster Mage", stock: 2, foilStock: 1, featured: true },
  { name: "Aether Vial", stock: 6, foilStock: 2 },
  { name: "Collected Company", stock: 8, foilStock: 2 },
  { name: "Goblin Guide", stock: 0, foilStock: 0 },
  { name: "Tarmogoyf", stock: 4, foilStock: 1 },
  { name: "The One Ring", stock: 1, foilStock: 0, featured: true },
  { name: "Esper Sentinel", stock: 6, foilStock: 2 },
];

function rarityLetter(r: string): string {
  switch (r) {
    case "mythic":
      return "M";
    case "rare":
      return "R";
    case "uncommon":
      return "U";
    default:
      return "C";
  }
}

type Scry = {
  id: string;
  oracle_id?: string;
  name: string;
  set: string;
  set_name: string;
  collector_number?: string;
  colors?: string[];
  rarity: string;
  type_line?: string;
  image_uris?: { normal?: string; large?: string };
  card_faces?: { image_uris?: { normal?: string; large?: string } }[];
  prices?: { usd?: string | null; usd_foil?: string | null };
  prints_search_uri?: string;
};

const headers = { "User-Agent": "MagicDojo/1.0", Accept: "application/json" };

async function fetchCard(name: string, setHint?: string): Promise<Scry | null> {
  const url = new URL("https://api.scryfall.com/cards/named");
  url.searchParams.set("exact", name);
  if (setHint) url.searchParams.set("set", setHint);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (setHint) return fetchCard(name); // retry without set hint
    console.warn(`  ! ${name}: ${res.status}`);
    return null;
  }
  let card = (await res.json()) as Scry;

  // If this printing has no USD price, pick a printing that does.
  if (!card.prices?.usd && card.prints_search_uri) {
    await sleep(120);
    const pr = await fetch(card.prints_search_uri, { headers });
    if (pr.ok) {
      const data = (await pr.json()) as { data?: Scry[] };
      const priced = (data.data ?? []).find((p) => p.prices?.usd);
      if (priced) card = priced;
    }
  }
  return card;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("Seeding from Scryfall…");

  // Fresh start: clear catalog (no orders exist yet during seed)
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  await prisma.setting.upsert({
    where: { key: "fxRate" },
    update: {},
    create: { key: "fxRate", value: "36" },
  });
  await prisma.setting.upsert({
    where: { key: "promptpayId" },
    update: {},
    create: { key: "promptpayId", value: "0812345678" },
  });
  await prisma.setting.upsert({
    where: { key: "bankInfo" },
    update: {},
    create: { key: "bankInfo", value: "ธนาคารกสิกรไทย · 123-4-56789-0 · Magic Dojo (ตัวอย่าง — แก้ในหน้าแอดมิน)" },
  });

  // Seed accounts (idempotent)
  await prisma.user.upsert({
    where: { email: "admin@magicdojo.local" },
    update: {},
    create: {
      email: "admin@magicdojo.local",
      name: "Shop Admin",
      passwordHash: await bcrypt.hash("admin1234", 10),
      isAdmin: true,
    },
  });
  await prisma.user.upsert({
    where: { email: "test@magicdojo.local" },
    update: {},
    create: {
      email: "test@magicdojo.local",
      name: "Test Customer",
      phone: "0800000000",
      passwordHash: await bcrypt.hash("test1234", 10),
    },
  });
  console.log("  ✓ seeded admin + test accounts");

  let ok = 0;
  for (const item of SEED) {
    const c = await fetchCard(item.name, item.setHint);
    await sleep(120); // be polite to Scryfall
    if (!c) continue;

    const img =
      c.image_uris?.normal ??
      c.image_uris?.large ??
      c.card_faces?.[0]?.image_uris?.normal ??
      null;

    await prisma.product.upsert({
      where: { scryfallId: c.id },
      update: {
        stock: item.stock,
        foilStock: item.foilStock,
        featured: item.featured ?? false,
        priceUsd: c.prices?.usd ? Number(c.prices.usd) : null,
        foilPriceUsd: c.prices?.usd_foil ? Number(c.prices.usd_foil) : null,
      },
      create: {
        scryfallId: c.id,
        oracleId: c.oracle_id ?? null,
        name: c.name,
        setCode: c.set.toUpperCase(),
        setName: c.set_name,
        collectorNumber: c.collector_number ?? null,
        colors: (c.colors ?? []).join(","),
        rarity: rarityLetter(c.rarity),
        typeLine: c.type_line ?? null,
        imageUrl: img,
        priceUsd: c.prices?.usd ? Number(c.prices.usd) : null,
        foilPriceUsd: c.prices?.usd_foil ? Number(c.prices.usd_foil) : null,
        stock: item.stock,
        foilStock: item.foilStock,
        featured: item.featured ?? false,
      },
    });
    ok++;
    console.log(`  ✓ ${c.name} [${c.set.toUpperCase()}]`);
  }

  console.log(`Done. ${ok}/${SEED.length} cards seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
