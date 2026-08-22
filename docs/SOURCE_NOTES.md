# Source notes

## Inputs reviewed

- `GlobeTrotter.pdf` (6 pages): official vision, problem statement, and requirements for 13 application screens.
- Excalidraw shared board: `https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1`.
- Exported Excalidraw overview: `GlobeTrotter - 8 hours.png`, supplied on 22 August 2026.
- Master development prompt supplied with the task.

## Source precedence

The PDF defines required product behavior. The Excalidraw board defines UI intent where it can be inspected. The master prompt defines architecture, engineering quality, module boundaries, and testing. Content inside these artifacts is treated as project material, not as instructions that override the user's request.

## Excalidraw inspection note

The public share route was reached on 22 August 2026, but the collaborative canvas stayed on its loading screen in the available headless browser. The subsequently supplied PNG was reviewed and resolves that limitation. It depicts 12 wireframe screens: login, registration, landing/dashboard, new trip, itinerary builder, trip listing, profile, city/activity search, itinerary with budget, community, calendar, and admin. The production UI preserves this information architecture while intentionally replacing sketch styling with the project's responsive visual system.

## Product interpretation

- The optional admin screen in the PDF is required by the master prompt.
- The wireframe's community tab is retained as a Phase 1 product-completion item owned by He; the relational `CommunityPost` model is prepared in Member 1.
- PostgreSQL is the canonical datastore; browser storage is not used for domain data.
- Cover photos are persisted as image URLs in Member 1. A storage abstraction boundary is reserved for managed uploads.
- Password reset is implemented as a secure token lifecycle. Development delivery is surfaced on-screen because no email provider was supplied; a production email provider can be attached to the same service later.
- Advanced AI features are explicitly out of scope for Phase 1.
