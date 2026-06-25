# Magic Dojo — Magic: The Gathering singles shop

A bilingual (Thai/English) e-commerce site selling single MTG cards, built with Claude Code
from a Claude Design prototype. This file is the handoff context — read it first.

## Where the app lives

The Next.js app is in the **`web/`** subfolder (not the repo root).
The repo root has a thin `package.json` whose `dev` script just delegates: `npm --prefix web run dev`.
`extracted/` holds the original design prototype (`Magic Dojo standalone.dc.html`) for reference.

## First-time setup (after unzipping)

```bash
cd web
npm install          # also runs `prisma generate` via postinstall
npm run db:push      # creates the SQLite DB from prisma/schema.prisma
npm run seed         # pulls ~24 real cards (images + USD prices) from Scryfall
npm run dev          # http://localhost:3000
```

`node_modules/`, `.next/`, and `src/generated/` are NOT in the zip — they regenerate from the
commands above. A seeded `web/prisma/dev.db` may be included; if missing, `db:push && seed` recreates it.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** (used lightly; most styling is inline styles driven by CSS variables)
- **Prisma 6** (pinned — v7 needs driver adapters). Client output: `web/src/generated/prisma`
- **SQLite** for local dev (`web/prisma/dev.db`). For production (Vercel) switch the datasource
  provider in `schema.prisma` to `postgresql`.
- Fonts via `next/font` (Noto Serif Thai, Chakra Petch, IBM Plex Sans Thai / Mono)
- No auth library yet; cart is client-side in `localStorage`.

## Data model (prisma/schema.prisma)

- **Product** — one Scryfall printing = one row. Holds non-foil + foil stock, USD prices
  (`priceUsd`, `foilPriceUsd`) and optional manual THB overrides
  (`priceOverrideThb`, `foilPriceOverrideThb`), plus `featured`.
- **Order** / **OrderItem** — defined in schema, not used yet (checkout is a placeholder).
- **Setting** — key/value; holds `fxRate` (USD→THB rate, default 36).

## Pricing

THB price = `roundUpTo5(USD × fxRate)`. A per-card/per-finish manual THB override wins when set.
Shipping: ฿50 flat, free for orders ≥ ฿1,000. Helpers live in `web/src/lib/i18n.ts`
(`roundBaht`, `fmtBaht`, `shippingFor`).

## Key files

- `web/src/lib/i18n.ts` — TH/EN translations (`TR`), theme color maps (`MANA`, `GRAD`),
  badge logic, price formatting. Ported verbatim from the design prototype.
- `web/src/lib/store.tsx` — client context: language toggle, theme (`dojo` light / `arena` dark),
  cart (localStorage), toast.
- `web/src/lib/products.ts` — server data layer: `decorate()` storefront view model,
  `getFeatured` / `getAllProducts` / `getProduct` / `getSets`, and `getAdminData()`.
- `web/src/lib/prisma.ts` — Prisma client singleton.
- `web/src/app/globals.css` — design tokens as `[data-theme]` CSS variables.
- Pages: `app/page.tsx` (Home), `app/shop`, `app/product/[id]`, `app/cart`,
  `app/admin` (+ `app/admin/actions.ts` server actions), `app/checkout` (placeholder).
- Components: `Header`, `Footer`, `Toast`, `HomeClient`, `ShopClient`, `ProductClient`,
  `CartClient`, `ProductCard`, `AdminClient`, `ComingSoon`.

## Build status

- ✅ **Phase 1 — Storefront**: Home, Shop (search + color/set filters + sort), Product
  (per-finish pricing), Cart (qty/remove, shipping, persistent). Real Scryfall images + THB prices.
- ✅ **Phase 3 — Admin** (`/admin`): stat cards, fx-rate panel (edit / fetch live rate from
  open.er-api.com / reset-to-market), filters, paginated grid with per-finish editable
  price + stock + featured toggle. Saves to DB via server actions + `revalidatePath`.
- ✅ **Phase 2 — Checkout** (`/checkout`): customer form (name + phone required), `placeOrder()`
  server action (`app/checkout/actions.ts`) recomputes prices server-side, validates stock, and
  creates Order + OrderItems while decrementing stock in one Prisma `$transaction`; success clears
  the cart and routes to `/order/[id]` confirmation. Payment is a manual transfer/PromptPay note for now.
- ✅ **Admin orders** (`/admin/orders`): list orders, expand for detail, change status
  (pending → paid → shipped / cancel / reopen) via `updateOrderStatus`. Linked from the admin header.
- ✅ **PromptPay QR**: the order confirmation page shows a real EMVCo PromptPay QR for the order
  amount (`lib/promptpay.ts`, recipient = Setting `promptpayId`); bank-transfer orders show
  Setting `bankInfo`. Both editable in the `/admin` shop-settings panel (`saveShopSetting`).
- ✅ **Accounts & auth** (`lib/auth.ts`, jose JWT in httpOnly cookie `md_session` + bcryptjs):
  `/login` (login + signup toggle, `AuthClient.tsx`), `/account` (profile + order history, logout),
  actions in `app/account/actions.ts`. Header shows the user (fetches `/api/me`). `/admin` + admin
  server actions are gated by `requireAdmin()`. Checkout prefills from and links orders to the
  logged-in user (`Order.userId`). Set `AUTH_SECRET` in `.env`. Seed accounts:
  `admin@magicdojo.local` / `admin1234` (admin), `test@magicdojo.local` / `test1234`.
- ⏳ **Phase 4 remainder — Card payments**: optional Stripe gateway (PromptPay QR already done).
- ⏳ **Phase 5 — Deploy**: switch Prisma to Postgres, deploy to Vercel, custom domain.
- ✅ **Responsive**: layouts collapse on tablet/phone via helper classes in `globals.css`
  (`.md-hero-layout`, `.md-sidebar-layout`, `.md-cart-layout`, `.md-checkout-layout`,
  `.md-product-layout`, `.md-values-grid`, `.md-featured-grid`, `.md-header-inner`) with
  `@media` breakpoints at 900px / 700px / 560px. No horizontal overflow at 375px. NOTE: these are
  plain CSS classes after `@import "tailwindcss"`; if edits to globals.css don't show up, clear
  `.next` and restart (Turbopack CSS cache can go stale).
- 🎨 Polish still optional: a theme (dark/arena) toggle button (store already supports `theme`).

## Seeding notes

`web/prisma/seed.ts` clears the catalog, then for each curated card name fetches Scryfall and —
importantly — follows `prints_search_uri` to pick a printing that HAS a USD price (the
`cards/named` default often returns a no-price promo printing, which would render as sold-out).
Avoid Scryfall `set` hints (many card/set combos 404). Add/remove cards by editing the `SEED` array.

## Design fidelity

The look is ported faithfully from the prototype: light "dojo" theme (cream bg, black ink,
red `#c11a1a` accent, Noto Serif Thai headings). Inline styles use CSS variables so the
alternate "arena" dark theme works by switching `data-theme` on `<html>`.
