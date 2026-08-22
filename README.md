# GlobeTrotter

GlobeTrotter is a production-oriented, responsive multi-city travel planner for shaping itineraries, discovering experiences, understanding costs, collaborating with friends, and sharing journeys publicly.

## Product coverage

- Secure credentials authentication, account recovery, profiles, and preferences
- Trip CRUD, 25 curated cities, 100 activities, saved destinations, and discovery filters
- Transactional drag-and-drop itinerary builder, calendar/timeline, and centralized budget analytics
- Public read-only itinerary links, safe trip copying, and private viewer/editor collaboration
- Searchable traveler community and role-protected administration analytics
- Responsive desktop/mobile navigation, accessible controls, loading/error states, and Docker deployment

## Technology

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL, Prisma, Auth.js
- Zod and server-side validation boundaries
- Lucide icons, Recharts, dnd-kit, Vitest, and Playwright

## Local setup

1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` and `AUTH_SECRET`.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npx prisma migrate deploy` to apply the committed database migration.
6. Load the curated discovery catalog with `npm run db:seed`.
7. Start the app with `npm run dev`.

Open `http://localhost:3000`, create an account, and build a trip. In development, password-recovery requests expose the generated single-use link in the UI because an email provider is not part of this repository yet.

For Docker, set a strong `AUTH_SECRET`, then run `docker compose up --build`. The app is served on `http://localhost:3000`. See [`docs/SETUP.md`](docs/SETUP.md) for deployment and administration details.

## Important routes

| Experience | Route |
| --- | --- |
| Dashboard and trips | `/dashboard`, `/trips` |
| Discovery and saved places | `/explore`, `/saved` |
| Builder, budget, and calendar | `/trips/[tripId]/builder`, `/budget`, `/calendar` |
| Sharing controls | `/trips/[tripId]/share` |
| Public itinerary | `/share/[slug]` |
| Community and profile | `/community`, `/profile` |
| Administrator analytics | `/admin` |

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Documentation

- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
- [`docs/REQUIREMENTS_TRACEABILITY.md`](docs/REQUIREMENTS_TRACEABILITY.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/SETUP.md`](docs/SETUP.md)
- [`docs/SOURCE_NOTES.md`](docs/SOURCE_NOTES.md)

Do not commit directly from an automation run. Each member receives a tested checkpoint, recommended branch, and commit message for their own push.
