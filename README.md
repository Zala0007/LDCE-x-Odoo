# GlobeTrotter

GlobeTrotter is a responsive, full-stack multi-city travel planner. It brings discovery, itinerary building, cost planning, calendars, collaboration, public sharing, community stories, profiles, and administration into one calm travel workspace.

The implementation follows the supplied product brief and 12-screen wireframe while extending the experience with persistent data, secure authorization, responsive behavior, release testing, and deployment assets.

## Product highlights

- Credentials authentication, secure password hashing, account recovery, profiles, and preferences
- Trip CRUD with status, dates, cover images, descriptions, and budgets
- Curated discovery catalog containing 25 cities and 100 activities
- Search, sorting, filters, estimated pricing, and saved destinations
- Transactional drag-and-drop itinerary builder with date and ownership integrity
- Day-by-day itinerary, budget analytics, charts, calendar, and timeline views
- Private viewer/editor collaboration and discoverable shared trips
- Public read-only itinerary links with safe trip duplication
- Searchable traveler community and role-protected admin analytics
- Responsive desktop/mobile navigation, accessible controls, and polished empty/error/loading states

## Screenshots

| Dashboard | Itinerary builder |
| --- | --- |
| [![Dashboard](docs/assets/screenshots/dashboard.png)](docs/assets/screenshots/dashboard.png) | [![Itinerary builder](docs/assets/screenshots/builder.png)](docs/assets/screenshots/builder.png) |

| Budget analytics | Public itinerary |
| --- | --- |
| [![Budget analytics](docs/assets/screenshots/budget.png)](docs/assets/screenshots/budget.png) | [![Public itinerary](docs/assets/screenshots/public-itinerary.png)](docs/assets/screenshots/public-itinerary.png) |

| Community | Admin analytics |
| --- | --- |
| [![Community](docs/assets/screenshots/community.png)](docs/assets/screenshots/community.png) | [![Admin analytics](docs/assets/screenshots/admin.png)](docs/assets/screenshots/admin.png) |

See the [complete 13-screen desktop/mobile gallery](docs/SCREENSHOTS.md), including Explore, My Trips, calendar, sharing, profile, and mobile dashboard captures.

## Technology

| Layer | Technology |
| --- | --- |
| Application | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS pipeline and responsive global design system |
| Data | PostgreSQL, Prisma ORM, committed SQL migration |
| Authentication | Auth.js credentials flow, bcrypt password hashing, JWT sessions |
| Validation | Zod schemas at server mutation boundaries |
| Interaction | dnd-kit, Recharts, Lucide icons |
| Quality | ESLint, strict TypeScript, Vitest, Playwright |
| Delivery | Next.js standalone output, Dockerfile, Docker Compose |

## Quick start

Requirements: Node.js 20+ and PostgreSQL 15+.

```bash
git clone <repository-url>
cd <repository-directory>
npm ci
```

Copy `.env.example` to `.env` and set:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globetrotter?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Prepare and run the application:

```bash
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000` and register a user. Development password-recovery requests expose a single-use reset link in the interface because email-provider credentials are intentionally outside this repository.

Detailed local, Docker, admin, and production guidance is in the [setup and deployment guide](docs/SETUP.md).

## Main routes

| Experience | Route | Access |
| --- | --- | --- |
| Landing and authentication | `/`, `/login`, `/signup` | Public |
| Dashboard and trip library | `/dashboard`, `/trips` | Authenticated |
| Discovery and saved places | `/explore`, `/saved` | Authenticated |
| Trip overview and itinerary | `/trips/[tripId]`, `/builder` | Owner, viewer, or editor |
| Budget and calendar | `/trips/[tripId]/budget`, `/calendar` | Owner, viewer, or editor |
| Sharing controls | `/trips/[tripId]/share` | Owner |
| Public itinerary | `/share/[slug]` | Public link |
| Community and profile | `/community`, `/profile` | Authenticated |
| Platform analytics | `/admin` | Administrator |

## Testing and report highlights

The He release checkpoint is fully green:

| Quality gate | Latest result | Report |
| --- | --- | --- |
| ESLint | Passed, 0 errors | [Static analysis](test-reports/static-analysis/README.md) |
| Strict TypeScript | Passed, 0 errors | [Static analysis](test-reports/static-analysis/README.md) |
| Unit tests | **29/29 passed**, 10 test files | [Vitest JSON](test-reports/unit/results.json) |
| End-to-end tests | **6/6 passed**, desktop Chromium + Pixel 7 | [Playwright HTML](test-reports/e2e/html/index.html) · [JSON](test-reports/e2e/results.json) |
| Production build | Passed, 23 routes compiled | [Static analysis](test-reports/static-analysis/README.md) |
| Database migration/seed | Passed, 25 cities + 100 activities | [Release quality](test-reports/RELEASE_QUALITY.md) |

All committed reports live in one place: [`test-reports/`](test-reports/README.md). The complete test strategy, folder conventions, coverage highlights, regeneration commands, and limitations are documented in [`docs/TESTING.md`](docs/TESTING.md).

Run the quality gates:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:reports
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` creates a production build and refreshes both the Playwright HTML and JSON reports.

## Test organization

```text
tests/
├── unit/                  # Validators, authorization, security, data, itinerary, budget
├── e2e/                   # Desktop/mobile browser journeys and server teardown
└── setup.ts               # Shared Vitest DOM setup

test-reports/
├── unit/results.json      # Machine-readable Vitest result
├── e2e/html/index.html    # Interactive Playwright report
├── e2e/results.json       # Machine-readable Playwright result
├── static-analysis/       # Lint, typecheck, build, migration summary
└── RELEASE_QUALITY.md     # Consolidated He checkpoint evidence
```

## Project organization

```text
app/                       # App Router pages, layouts, API route, server actions
components/                # UI, shell, discovery, itinerary, sharing, admin modules
lib/
├── auth/                  # Authorization policy
├── repositories/          # Database read boundaries
├── services/              # Transactional business workflows
├── validators/            # Zod input contracts
└── data/                  # Curated travel catalog
prisma/                    # Schema, release migration, and seed
scripts/                   # E2E server and reproducible documentation capture
docs/                      # Architecture, setup, screenshots, tests, traceability
tests/                     # Maintained unit and browser test suites
test-reports/              # Centralized committed release evidence
```

## Reproducing documentation screenshots

After migrating and seeding a local PostgreSQL database:

```bash
npx playwright install chromium
npm run docs:screenshots
```

This command builds the production application, prepares a dedicated local documentation fixture (`he.demo@globetrotter.local`), and refreshes the 13 images under `docs/assets/screenshots/`. The fixture is for local documentation only and must not be used as a production credential.

## Documentation index

- [Documentation home](docs/README.md)
- [Screenshots gallery](docs/SCREENSHOTS.md)
- [Testing and reports](docs/TESTING.md)
- [Setup and deployment](docs/SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Requirements traceability](docs/REQUIREMENTS_TRACEABILITY.md)
- [Implementation plan and team ownership](docs/IMPLEMENTATION_PLAN.md)
- [Source notes](docs/SOURCE_NOTES.md)

## Team delivery

| Priority | Member | Delivered scope |
| --- | --- | --- |
| 1 | V | Foundation, authentication, protected shell, trip core |
| 2 | Hi | Dashboard, discovery, saved destinations, curated catalog |
| 3 | K | Itinerary builder, budget engine, calendar/timeline |
| 4 | He | Sharing, profile, community, admin, QA reports, screenshots, deployment |

The current documentation/report update belongs to **He** and should be committed and pushed from the He account. Automation does not commit or push repository changes.
