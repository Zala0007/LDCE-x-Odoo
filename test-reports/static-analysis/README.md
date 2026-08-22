# Static analysis and build report

Verified on 22 August 2026.

| Command | Status | Highlight |
| --- | --- | --- |
| `npm run lint` | Pass | ESLint completed with zero errors or warnings |
| `npm run typecheck` | Pass | Strict TypeScript compilation completed with no emitted output |
| `git diff --check` | Pass | No whitespace errors or conflict markers |
| `npm run build` | Pass | Optimized Next.js production build completed for 23 routes |
| `npx prisma migrate deploy` | Pass | Initial release migration applied to PostgreSQL |
| `npm run db:seed` | Pass | 25 cities and 100 activities loaded |

The build includes the public landing/authentication pages, authenticated dashboard and trip workflows, itinerary builder, budget analytics, calendar, sharing controls, public itinerary, community, profile, and role-protected admin analytics.
