# Requirements traceability

## 12-screen wireframe acceptance map

| Screen | Required experience | Implemented route(s) | Evidence |
| --- | --- | --- | --- |
| 1 | Login | `/login`, `/forgot-password`, `/reset-password` | Credentials flow, recovery, validation, responsive auth design |
| 2 | Registration and traveler details | `/signup`, `/profile` | Name, email, phone, city, country, photo URL, biography, preferences |
| 3 | Main landing dashboard | `/dashboard`, `/explore` | Hero, destination search/group/filter/sort, popular places, recent/upcoming trips, plan-trip action |
| 4 | Create a new trip | `/trips/new` | Dates, budget, cover, starting-place suggestions, automatic first itinerary section |
| 5 | Build itinerary sections | `/trips/[tripId]/builder` | City sections, dates, section budgets, activities, drag-and-drop ordering, add section |
| 6 | User trip listing | `/trips` | Ongoing, upcoming, draft, and completed groups with search/filter/group/sort |
| 7 | User profile | `/profile` | Editable traveler details, preplanned trips, previous trips, saved destinations |
| 8 | Activity/city search | `/explore`, `/trips/[tripId]/cities`, `/trips/[tripId]/activities` | Search, group, filters, sorting, detailed cards, add/save actions |
| 9 | Itinerary, route, and budget view | `/trips/[tripId]`, `/trips/[tripId]/map`, `/trips/[tripId]/budget` | Interactive mapped route, numbered stops, distances, day timeline, activities, expense totals, category breakdown, charts |
| 10 | Community tab | `/community` | Story creation, linked trips, search, country/type filters, grouping, sorting |
| 11 | Calendar view | `/trips/[tripId]/calendar` | Month calendar and ordered activity timeline |
| 12 | Admin panel | `/admin` | Direct section navigation, user management, popular cities/activities, trends and analytics |

Every surface uses the responsive top navigation; there is no side navigation.

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
| Interactive route map | Product enhancement | `/trips/[tripId]/map` | City coordinates, TripStop | MapLibre route line, markers, and distance service | route geometry + build tests | Complete |
| Calendar/timeline | PDF §10, prompt M3 | `/trips/[tripId]/calendar` | ItineraryActivity | calendar/timeline + persistent ordering | validator/build tests | M3 complete |
| Public sharing/copy | PDF §11, prompt M4 | `/share/[slug]` | PublicShareLink | sharing/copy service | sharing validators + E2E | M4 complete |
| Friend sharing | Problem statement, prompt M4 | `/trips/[tripId]/share` | TripShare | sharing service + permission-aware itinerary | sharing + authorization tests | M4 complete |
| Profile/settings | PDF §12, prompt M4 | `/profile` | User, UserPreference | profile form/actions | profile validators | M4 complete |
| Admin analytics | PDF §13, prompt M4 | `/admin` | User, Trip, City, Activity | live aggregate queries + charts | role/build tests | M4 complete |
| Community feed | Excalidraw screen 10, overall vision | `/community` | CommunityPost, User, Trip | searchable feed + post actions | community validators | M4 complete |
