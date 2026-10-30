# AGENTS.md

Khuy Cleaner — a Vietnamese single-page site for booking hourly home cleaning. All UI copy is Vietnamese.

## Architecture

| Layer      | Technology                                                       |
| ---------- | ---------------------------------------------------------------- |
| Framework  | TanStack Start (React 19, TanStack Router, Vite 8)               |
| Data       | Netlify Database (Postgres) via Drizzle ORM (`drizzle-orm/netlify-db`) |
| Styling    | Plain CSS in `src/site.css` (Tailwind is installed but unused by the page) |
| Images     | Netlify Image CDN (`/.netlify/images?url=/img/...`)              |
| Deployment | Netlify via `@netlify/vite-plugin-tanstack-start`                |

## Key files

```
db/schema.ts                 # Tables: bookings, staff_reviews
db/index.ts                  # Drizzle client
netlify/database/migrations/ # Generated migrations (never edit applied ones)
src/lib/khuy.ts              # Single source of truth: services, packages (hours→m²), pricing, voucher tiers, staff roster, validation
src/routes/index.tsx         # The whole landing page + booking form + booking dialog
src/routes/api.bookings.ts   # POST: validate, apply loyalty voucher server-side, save booking
src/routes/api.loyalty.ts    # GET ?phone=: previous booking count, current/next voucher tier
src/routes/api.reviews.ts    # GET: per-staff averages + recent reviews; POST: add review
src/components/khuy/         # about.tsx (intro + packages), voucher.tsx, staff.tsx
src/site.css                 # All page styles (ported from the original design) + additions at the bottom
public/img/clean-home.png    # Hero image
```

## Conventions & decisions

- Business rules live in `src/lib/khuy.ts` and are shared by client and server. The server always recomputes price and voucher — never trust client totals.
- Loyalty is keyed by a normalised phone number (`phoneKey`: `+84…`/`84…` → `0…`). Tier = number of *earlier* requests for that phone (2 → 5%, 5 → 10%, 9 → 15%).
- Staff are a static list in `src/lib/khuy.ts` (slug + name); reviews reference staff by slug. Adding staff only needs a new entry there.
- Booking POSTs are idempotent via a client-generated UUID `id`.
- Both forms use a hidden `website` honeypot field.
- Schema changes: edit `db/schema.ts`, then `npx drizzle-kit generate --name <name>`. Do not run migrate/push.
- Keep CSS class naming in `site.css` style (BEM-ish plain classes), not Tailwind utilities, to match the existing page.

## Next steps (see README roadmap)

Admin view for confirming bookings, counting only completed bookings toward vouchers, and tying reviews to real booking references.
