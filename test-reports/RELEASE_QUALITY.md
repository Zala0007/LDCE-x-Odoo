# Release quality report

Report date: 22 August 2026  
Platform: Windows, Node.js 22.17.0  
Application: Next.js 15.5.23, React 19, Prisma 6.19.3

## Result highlights

| Gate | Result | Evidence |
| --- | --- | --- |
| ESLint | Pass, 0 errors | [Static analysis report](./static-analysis/README.md) |
| TypeScript | Pass, strict `tsc --noEmit` | [Static analysis report](./static-analysis/README.md) |
| Unit tests | Pass, 34/34 across 11 files | [Vitest JSON](./unit/results.json) |
| Browser tests | Pass, 6/6 across desktop and mobile | [Playwright HTML](./e2e/html/index.html) · [JSON](./e2e/results.json) |
| Production build | Pass, 24 application routes | [Static analysis report](./static-analysis/README.md) |
| Prisma migrations | Pass, including persisted city coordinates | [`prisma/migrations`](../prisma/migrations/) |
| Curated seed | Pass, 25 cities and 100 activities | [`seed.ts`](../prisma/seed.ts) |

## Tested behavior

- Authentication and password-policy validation
- Password hashing and verification without plaintext persistence
- Owner authorization and trip input validation
- Discovery filtering and curated catalog integrity
- Ordered stop/activity validation and centralized budget calculations
- Route-distance calculations and coordinate integrity for all 25 cities
- Profile, community-post, and viewer/editor sharing validation
- Landing, login, and registration experiences at desktop Chrome and Pixel 7 dimensions
- Production compilation of authenticated, interactive map, public sharing, community, and admin routes

## Dependency audit note

`npm audit --omit=dev` reported six upstream high-severity advisories through the current Next.js/Sharp/PostCSS and Prisma dependency trees. The automated full remediation proposes a breaking Next.js 16 upgrade, so no forced dependency rewrite was applied to this release checkpoint. Upgrade work should be handled as a separately tested maintenance change.

Docker Compose runtime validation was not available on this workstation because the Docker CLI is not installed. The Dockerfile, Compose manifest, standalone Next.js build, Prisma migration, and PostgreSQL seed were validated independently.
