# Setup and deployment

## Local development

GlobeTrotter requires Node.js 20+ and PostgreSQL 15+. Copy `.env.example` to `.env` and provide a PostgreSQL URL, a strong random `AUTH_SECRET`, and the browser-visible application URL.

```bash
npm ci
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

The seed is idempotent for the curated city and activity catalog. Register normal users through `/signup`. To grant an administrator role, update the intended user explicitly:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Do not expose seeded or shared passwords in production. Password reset links are returned in the development UI because this project deliberately has no email-provider credential.

## Docker Compose

Create an `.env` containing at least a strong `AUTH_SECRET`, then run:

```bash
docker compose up --build
docker compose exec app npm run db:seed
```

Compose starts PostgreSQL, waits for its health check, applies committed migrations, and starts the standalone Next.js server on port 3000. The named volume `globetrotter_postgres` preserves database data.

## Production checklist

- Use a managed PostgreSQL database with backups and restricted network access.
- Generate `AUTH_SECRET` from a cryptographically secure random source.
- Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin so public links are correct.
- Run `npx prisma migrate deploy` once per release before starting application traffic.
- Place the container behind TLS and a reverse proxy or managed container platform.
- Add a transactional email provider before enabling password recovery for real users.
- Review dependency audits, container scanning, logs, and database backups in CI/CD.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite exercises public pages on desktop Chromium and a Pixel 7 viewport. Authenticated journeys additionally require a migrated and seeded database.

## Test reports

```bash
npm run test:reports
npm run test:e2e
```

Reports are centralized under [`test-reports/`](../test-reports/README.md). The unit command writes Vitest JSON; the E2E command creates a production build and writes Playwright HTML/JSON evidence.

## Documentation screenshots

To reproduce the gallery after migration and catalog seeding:

```bash
npx playwright install chromium
npm run docs:screenshots
```

This creates or resets only `he.demo@globetrotter.local`, prepares realistic local fixture data, and captures 19 images under `docs/assets/screenshots/`. The fixture credential exists only for local documentation generation and must never be deployed as a real account.
