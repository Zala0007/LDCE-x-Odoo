# GlobeTrotter

GlobeTrotter is a responsive multi-city travel planner for shaping itineraries, discovering experiences, understanding costs, and sharing journeys. The product is being delivered in four intentionally isolated team modules.

## Current checkpoint

Members 1–2 / V + Hi: application foundation, secure authentication, owned-trip CRUD, database-backed dashboard, destination/activity discovery, saved cities, and a travel catalog of 25 cities with 100 activities.

## Technology

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL, Prisma, Auth.js
- Zod and server-side validation boundaries
- Lucide icons and Vitest; later modules add Recharts, dnd-kit, and Playwright

## Local setup

1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` and `AUTH_SECRET`.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate -- --name init` for a new database.
6. Load the curated discovery catalog with `npm run db:seed`.
7. Start the app with `npm run dev`.

Open `http://localhost:3000`, create an account, and build a trip. In development, password-recovery requests expose the generated single-use link in the UI because an email provider is not part of this repository yet.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- [`docs/REQUIREMENTS_TRACEABILITY.md`](docs/REQUIREMENTS_TRACEABILITY.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/SOURCE_NOTES.md`](docs/SOURCE_NOTES.md)

Do not commit directly from an automation run. Each member receives a tested checkpoint, recommended branch, and commit message for their own push.
