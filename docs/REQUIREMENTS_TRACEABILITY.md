# Requirements traceability

| Requirement | Source | Route | Database model | Component/service | Test | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Signup/login/logout | PDF §1, prompt M1 | `/signup`, `/login` | User, Account, Session | auth actions/Auth.js | auth validators + password service | M1 |
| Forgot/reset password | PDF §1, prompt M1 | `/forgot-password`, `/reset-password` | PasswordResetToken | password reset service | token tests | M1 |
| Protected app shell | Prompt M1 | authenticated routes | Session | AppShell, UserMenu | auth policy tests | M1 |
| Create trip | PDF §3, prompt M1 | `/trips/new` | Trip | TripForm, trip actions | trip validator tests | M1 |
| My Trips CRUD | PDF §4, prompt M1 | `/trips`, `/trips/[tripId]/edit` | Trip, TripStop | TripCard, repository | authorization tests | M1 |
| Dashboard | PDF §2, prompt M2 | `/dashboard` | Trip, City | dashboard repository/cards | seed + build tests | M2 complete |
| City search | PDF §7, prompt M2 | `/trips/[tripId]/cities`, `/explore` | City, TripStop | discovery repository/cards | discovery filter tests | M2 complete |
| Activity search | PDF §8, prompt M2 | `/trips/[tripId]/activities` | Activity, ItineraryActivity | activity repository/cards | discovery filter tests | M2 complete |
| Saved destinations | PDF §12, prompt M2 | `/saved` | SavedDestination | destination actions | schema/build tests | M2 complete |
| Itinerary builder | PDF §5, prompt M3 | `/trips/[tripId]/builder` | TripStop, ItineraryActivity | transactional itinerary service + dnd-kit builder | validator/build tests | M3 complete |
| Itinerary view | PDF §6, prompt M3 | `/trips/[tripId]` | Trip, TripStop, ItineraryActivity | day timeline | budget/build tests | M3 complete |
| Budget breakdown | PDF §9, prompt M3 | `/trips/[tripId]/budget` | Trip, stops, activities | central budget service + Recharts | budget service tests | M3 complete |
| Calendar/timeline | PDF §10, prompt M3 | `/trips/[tripId]/calendar` | ItineraryActivity | calendar/timeline + persistent ordering | validator/build tests | M3 complete |
| Public sharing/copy | PDF §11, prompt M4 | `/share/[slug]` | PublicShareLink | sharing/copy service | sharing validators + E2E | M4 complete |
| Friend sharing | Problem statement, prompt M4 | `/trips/[tripId]/share` | TripShare | sharing service + permission-aware itinerary | sharing + authorization tests | M4 complete |
| Profile/settings | PDF §12, prompt M4 | `/profile` | User, UserPreference | profile form/actions | profile validators | M4 complete |
| Admin analytics | PDF §13, prompt M4 | `/admin` | User, Trip, City, Activity | live aggregate queries + charts | role/build tests | M4 complete |
| Community feed | Excalidraw screen 10, overall vision | `/community` | CommunityPost, User, Trip | searchable feed + post actions | community validators | M4 complete |
