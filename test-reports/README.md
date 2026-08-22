# GlobeTrotter test reports

This directory keeps the test evidence for the He release checkpoint in one place.

| Report | Format | What it covers |
| --- | --- | --- |
| [Release quality summary](./RELEASE_QUALITY.md) | Markdown | Human-readable result highlights, environment, commands, and limitations |
| [Unit test results](./unit/results.json) | Vitest JSON | 10 suites and 29 validation, authorization, security, catalog, itinerary, and budget tests |
| [End-to-end report](./e2e/html/index.html) | Playwright HTML | Desktop Chromium and Pixel 7 coverage for public entry and authentication screens |
| [End-to-end raw results](./e2e/results.json) | Playwright JSON | Machine-readable status, timing, projects, and assertions |
| [Static analysis](./static-analysis/README.md) | Markdown | ESLint, strict TypeScript, diff integrity, and production compilation |

## Regenerating reports

```bash
npm run test:reports
npm run test:e2e
```

`test:e2e` creates a production build before running Playwright. The HTML and JSON outputs are overwritten with the newest results. Failure traces and screenshots are placed under `test-reports/e2e/artifacts/`.
