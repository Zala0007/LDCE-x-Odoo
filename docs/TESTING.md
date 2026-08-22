# Testing and quality reports

## Suite organization

```text
tests/
├── unit/
│   ├── auth-validator.test.ts
│   ├── authorization.test.ts
│   ├── budget-service.test.ts
│   ├── discovery-validator.test.ts
│   ├── itinerary-validator.test.ts
│   ├── password-service.test.ts
│   ├── profile-validator.test.ts
│   ├── route-geometry.test.ts
│   ├── sharing-validator.test.ts
│   ├── travel-data.test.ts
│   └── trip-validator.test.ts
├── e2e/
│   ├── public-pages.spec.ts
│   └── global-teardown.ts
└── setup.ts
```

Unit tests remain fast and database-independent. Playwright uses an optimized production build and runs every browser check in desktop Chromium and a Pixel 7 viewport. Its managed test server copies the standalone static assets and is terminated explicitly on Windows and CI.

## Current results

| Layer | Status | Coverage highlight |
| --- | --- | --- |
| Unit | 34/34 passed | Authentication, authorization, passwords, trip/itinerary/profile/sharing schemas, catalog coordinates, route distance, discovery, budget |
| E2E | 6/6 passed | Landing, login, and complete registration form on desktop and mobile |
| Static | Passed | ESLint and strict TypeScript |
| Build | Passed | 24 application routes compiled for production |
| Data | Passed | Release migration, 25 cities, 100 activities |

## Commands

```bash
# Human-readable unit run
npm run test

# Unit run plus committed JSON evidence
npm run test:reports

# Production build plus Playwright HTML/JSON reports
npm run test:e2e

# Individual static gates
npm run lint
npm run typecheck
npm run build
```

Install the browser once on a new workstation:

```bash
npx playwright install chromium
```

## Central report directory

All reports are under [`test-reports/`](../test-reports/README.md):

- [`RELEASE_QUALITY.md`](../test-reports/RELEASE_QUALITY.md): consolidated result and limitation summary
- [`unit/results.json`](../test-reports/unit/results.json): raw Vitest output
- [`e2e/html/index.html`](../test-reports/e2e/html/index.html): interactive Playwright report
- [`e2e/results.json`](../test-reports/e2e/results.json): raw Playwright output
- [`static-analysis/README.md`](../test-reports/static-analysis/README.md): lint, type, build, migration, and seed evidence

Playwright failure traces, screenshots, and videos are written to `test-reports/e2e/artifacts/`. Passing runs normally leave that directory empty.

## Maintenance rules

- Put deterministic, isolated logic tests in `tests/unit/`.
- Put browser journeys in `tests/e2e/` and run them against the production build.
- Keep test fixtures scoped to unique users/records and never reuse production credentials.
- Refresh the JSON/HTML reports when behavior or assertions change.
- Update `RELEASE_QUALITY.md` when versions, totals, known limitations, or quality gates change.
- Do not weaken authorization or validation assertions to make a failing test pass.
