# Architecture

GlobeTrotter is a server-first Next.js application. React Server Components read through repositories, Server Actions handle validated mutations, Auth.js owns signed sessions, and Prisma maps the relational PostgreSQL domain.

## Layers

1. `app/`: routes, layouts, loading/error boundaries, and server actions.
2. `components/`: reusable presentational and interactive UI.
3. `lib/validators/`: Zod schemas at every mutation boundary.
4. `lib/services/`: workflows such as registration and password reset.
5. `lib/repositories/`: authorized persistence queries.
6. `lib/auth/`: session helpers and authorization policy.
7. `lib/storage/`: replaceable cover-image boundary.
8. `prisma/`: schema, migrations, and seed data.
9. `tests/unit/`: deterministic validator, policy, security, catalog, itinerary, and budget coverage.
10. `tests/e2e/`: production-build browser journeys across desktop and mobile viewports.
11. `test-reports/`: committed JSON, HTML, and human-readable release evidence.

## Security model

- Credentials are hashed with bcrypt and never returned by repository projections.
- Auth.js uses signed JWT sessions for credentials compatibility and the Prisma adapter keeps provider/account data relational.
- Protected layouts redirect anonymous requests before rendering private data.
- Every trip mutation resolves the authenticated user. Owner-only operations include `ownerId` in database predicates; itinerary collaboration additionally requires an explicit `EDITOR` share.
- Reset tokens use cryptographically secure random bytes; only a SHA-256 digest is stored.
- Inputs are parsed by Zod on the server. Client checks improve feedback but are not trusted.

## Domain model

`User` owns `Trip`; a trip contains ordered `TripStop` records, each linked to a `City` with a persisted geographic center. Ordered `ItineraryActivity` records connect stops to catalog `Activity` records. `TripShare` and `PublicShareLink` model private and public sharing separately. `SavedDestination` is a user-city join. `UserPreference` is a one-to-one extension. `CommunityPost` belongs to an author and can optionally reference a trip.

## Route mapping

The authorized route page reads the same ordered stops as the itinerary. A client-only MapLibre renderer connects `[longitude, latitude]` coordinates as GeoJSON, fits the camera to the route, and keeps its numbered map markers synchronized with an accessible HTML stop list. Great-circle distance calculations live in `lib/maps/` and remain independent of the rendering provider. The visual basemap uses OpenFreeMap without an application API key; trip data and calculations continue to render in the side panel if third-party tiles are unavailable.

## Sharing permissions

| Relationship | Read itinerary | Edit itinerary | Manage trip/shares | Copy trip |
| --- | --- | --- | --- | --- |
| Owner | Yes | Yes | Yes | Yes |
| Editor share | Yes | Yes | No | Yes |
| Viewer share | Yes | No | No | Yes |
| Active public link | Yes | No | No | Yes, after authentication |

## Extension points

The budget service, itinerary ordering transactions, media storage adapter, notification delivery, and recommendation providers are isolated so later modules can add functionality without placing business logic in UI components.
