# Website screenshots

These screenshots were captured from the production build at 1440×1000, plus a 390×844 mobile dashboard. They use a reproducible local fixture with realistic trips, itinerary activities, community stories, saved cities, sharing, and admin analytics.

## Core planning experience

### Dashboard

[![Dashboard](./assets/screenshots/dashboard.png)](./assets/screenshots/dashboard.png)

### Destination discovery

[![Explore destinations](./assets/screenshots/explore.png)](./assets/screenshots/explore.png)

### My Trips

[![My Trips](./assets/screenshots/my-trips.png)](./assets/screenshots/my-trips.png)

### Trip itinerary

[![Trip itinerary](./assets/screenshots/itinerary.png)](./assets/screenshots/itinerary.png)

### Drag-and-drop itinerary builder

[![Itinerary builder](./assets/screenshots/builder.png)](./assets/screenshots/builder.png)

### Budget analytics

[![Budget analytics](./assets/screenshots/budget.png)](./assets/screenshots/budget.png)

### Calendar

[![Calendar](./assets/screenshots/calendar.png)](./assets/screenshots/calendar.png)

## Sharing and community

### Sharing controls

[![Sharing controls](./assets/screenshots/sharing.png)](./assets/screenshots/sharing.png)

### Public itinerary

[![Public itinerary](./assets/screenshots/public-itinerary.png)](./assets/screenshots/public-itinerary.png)

### Traveler community

[![Traveler community](./assets/screenshots/community.png)](./assets/screenshots/community.png)

## Account and administration

### Profile and settings

[![Profile and settings](./assets/screenshots/profile.png)](./assets/screenshots/profile.png)

### Admin analytics

[![Admin analytics](./assets/screenshots/admin.png)](./assets/screenshots/admin.png)

### Mobile dashboard

[![Mobile dashboard](./assets/screenshots/dashboard-mobile.png)](./assets/screenshots/dashboard-mobile.png)

## Regenerating the gallery

With PostgreSQL configured and Chromium installed:

```bash
npx prisma migrate deploy
npm run db:seed
npx playwright install chromium
npm run docs:screenshots
```

The generator resets only the dedicated `he.demo@globetrotter.local` fixture and does not delete other users. Never use the documentation password as a production credential.
