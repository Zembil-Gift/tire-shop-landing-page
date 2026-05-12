# Putnam Tire — Frontend Implementation Guide (Updated)

## Codebase Audit

This guide reflects the current state of the deployed codebase at `tire-shop-landing-page.onrender.com`.
It documents what is already built, what is partially built, what has bugs/incorrect data, and what still needs to be built from scratch.

---

## Current Architecture

The project is a **single-page application with no routing**. All sections are rendered as scroll sections within one page (`TireShopLandingPage.tsx`). There are no separate page routes, no admin interface, and no API integration. The entire app renders via `App.tsx → TireShopLandingPage.tsx`.

---

## Tech Stack (Already In Place)

| Tool | Status |
|------|--------|
| React 18 | ✅ Installed |
| TypeScript | ✅ Installed |
| Tailwind CSS v4 | ✅ Installed (using `@import "tailwindcss"`) |
| Vite | ✅ Installed |
| Lucide React | ✅ Installed |
| React Router | ❌ Not installed — needs to be added |
| Axios | ❌ Not installed — needs to be added |

---

## Color Scheme Audit

The spec called for Red, Black, White, and Gray. The current implementation uses:

| Color | Spec | Current Implementation | Action |
|-------|------|----------------------|--------|
| Primary red | `#CC0000` | `red-600` = `#DC2626` — close but slightly brighter | ✅ Acceptable — keep `red-600` / `red-700` throughout |
| Dark/Black | `#111111` | `slate-950` = `#020617` on footer only | ⚠️ Navbar uses `bg-white`, not dark. Footer uses `bg-slate-950`. Navbar should use `bg-gray-950` or `bg-neutral-950` to match spec |
| White | `#FFFFFF` | `bg-white` used on cards and about section | ✅ Correct |
| Gray (backgrounds) | `#F5F5F5` light gray | `bg-slate-50` = `#F8FAFC` and `bg-slate-100` used | ✅ Acceptable — keep as-is |
| Gray (text) | `#9CA3AF` | `text-slate-600` used for body text | ✅ Acceptable |

**Color correction needed:** The navbar background is currently `bg-white/95`. Per spec the navbar should be dark (`bg-neutral-950` or `bg-gray-950`) with white text and the red CTA button. Update the `Header.tsx` background and text colors accordingly.

---

## Data Bugs Found in `siteData.ts`

These must be corrected before further development:

| Field | Current (Wrong) | Correct Value |
|-------|----------------|--------------|
| `displayPhone` | `"(214) 555-1234"` | `"(601) 366-1886"` |
| `hours` | Contains `"895"` typo, formatting broken | `"Mon–Fri: 8:00 AM – 6:00 PM · Sat: 9:00 AM – 5:00 PM · Sun: 9:30 AM – 5:00 PM"` |
| `services` list | Missing: Tire Installation, Tire Replacement, Wheel Alignment, Rim Repair, Truck & SUV Tires | Replace full list with the 8 services from spec |
| `phone` vs `displayPhone` | Two separate fields but `displayPhone` is wrong | Unify to one correct value: `"(601) 366-1886"` |

**Correct `services` array:**
```
"New Tire Sales"
"Tire Installation"
"Flat Tire Repair"
"Tire Replacement"
"Wheel Balancing"
"Wheel Alignment"
"Rim Repair"
"Truck & SUV Tires"
```

---

## Component-by-Component Status

### ✅ Header (`Header.tsx`) — Built, needs color fix

What is done:
- Sticky navbar with logo and business name
- Desktop nav links (Home, Services, About, Reviews, Contact)
- "Call Now" button with `tel:` link
- Mobile hamburger menu with slide-down nav

What needs to change:
- Background: change `bg-white/95` → `bg-neutral-950` (dark per spec)
- Nav link text: change to `text-slate-200 hover:text-red-500`
- Business name text: change to `text-white`
- Mobile menu background: change `bg-white` → `bg-neutral-950`, links to `text-white`
- Add missing nav links: "Get Quote", "Schedule", "Track Status" (once those pages/sections exist)

---

### ✅ Home / Hero Section (`Home.tsx`) — Built, good shape

What is done:
- Full-height hero with background image (`tire-banner.png`) and dark overlay
- Business name heading
- Tagline paragraph
- "Call Now" button (click-to-call)
- "Book Appointment" button (anchor link to `#booking`)

What needs to change:
- Add a third CTA button: "Get Tire Quote" → links to `#quote` (once that section exists)
- Add a fourth CTA button: "Track My Status" → links to `#track-status` (once that section exists)
- The overlay is currently `bg-black/45` — acceptable, keep as-is

---

### ✅ Services Section (`Services.tsx`) — Built, data needs update

What is done:
- Section heading and subheading
- Grid of service cards with icon, title, and description
- Hover animation (`hover:-translate-y-1`)

What needs to change:
- Service list pulled from `siteData.ts` — update `services` array in `siteData.ts` to the correct 8 services (see Data Bugs above)
- Each card currently shows a generic description — acceptable for MVP

---

### ✅ About Section (`About.tsx`) — Built, acceptable

What is done:
- Two-column layout: text left, feature cards right
- 4 feature cards: Quick Turnaround, Trusted Technicians, Local Shop, Fair Pricing
- Red accent icons

What needs to change:
- None for MVP — section is complete

---

### ⚠️ Booking Section (`Booking.tsx`) — Partially built, not connected to backend

What is done:
- Section heading
- Form with: Full Name, Phone Number, Vehicle Type, Service dropdown, Date, Time, Message textarea
- Submit button (UI only)

What is missing / needs fixing:
- Form has **no `action`, no `onSubmit` handler, no state, no validation** — it is purely visual
- Missing required fields per spec: Email, Vehicle Make, Vehicle Model
- "Vehicle type" field should be split into separate Vehicle Make and Vehicle Model fields
- Service dropdown options do not match spec (currently has "Used Tires", "Roadside Assistance" which are not in the appointment service types)
- **Correct service options:** Tire Installation, Flat Tire Repair, Tire Replacement, Wheel Balancing, Wheel Alignment, Rim Repair
- Add form state management (React `useState` for each field)
- Add field validation (required fields, email format, phone format)
- Connect submit button to `POST /api/appointments` via Axios
- Show success message on submit
- Show error message on API failure
- Disable button while request is in flight

---

### ✅ Reviews Section (`Reviews.tsx`) — Built, acceptable for MVP

What is done:
- Three review cards with 5-star rating, quote text, and reviewer name
- Data pulled from `siteData.ts`

What needs to change:
- None for MVP

---

### ✅ Contact Section (`Contact.tsx`) — Built, needs data fix

What is done:
- Two-column layout: contact info left, Google Maps embed right
- Phone, address, hours displayed with icons
- Google Maps iframe embedded with correct address

What needs to change:
- `displayPhone` shows wrong number — fix in `siteData.ts` (see Data Bugs)
- `hours` string has a `"895"` typo — fix in `siteData.ts`
- Add a "Call Now" click-to-call button in this section

---

### ✅ Footer (`Footer.tsx`) — Built, minimal

What is done:
- Dark background (`bg-slate-950`)
- Business name and copyright line

What needs to change:
- Add quick nav links to all sections
- Add Google Business Profile link (URL to be provided by client)
- Address line is missing from footer — add it

---

## What Still Needs to Be Built

The following features are entirely absent from the current codebase and must be built from scratch.

---

### 🔴 Get Tire Quote Section / Page

Currently does not exist anywhere in the codebase.

Add as a new section with `id="quote"` (for single-page) or a new route `/get-quote` (for multi-page).

Required form fields:

| Field | Input Type | Required |
|-------|------------|----------|
| Full Name | Text | Yes |
| Phone Number | Tel | Yes |
| Email | Email | Yes |
| Vehicle Year | Number | Yes |
| Vehicle Make | Text | Yes |
| Vehicle Model | Text | Yes |
| Tire Size | Text | Yes |
| Quantity Needed | Number | Yes |
| Preferred Tire Type | Select | Yes |
| Additional Message | Textarea | No |

Preferred Tire Type options: Budget, Mid-range, Premium, Not sure

On submit: POST to `/api/quotes`
On success: show confirmation message
On error: show error message
While loading: disable submit button

---

### 🔴 Track Work Status Section / Page

Currently does not exist anywhere in the codebase.

Add as a new section with `id="track-status"` or a new route `/track-status`.

UI requirements:
- Tab or toggle to switch between two search modes: "Search by Phone" and "Search by Work Order Number"
- Single input field per mode
- Submit button

On submit: GET `/api/work-orders/status?phone=...` or `?workOrderNumber=...`

Result display (shown after successful lookup):
- Work Order Number
- Service Type
- Status (as a colored badge)
- Estimated Completion Time
- Staff Note (if present)

If no result found: display "No work order found for the information provided."

Status badge colors:

| Status | Color |
|--------|-------|
| Request Received | Gray |
| Appointment Confirmed | Blue |
| Vehicle Received | Yellow |
| Work In Progress | Orange |
| Waiting for Tires | Purple |
| Ready for Pickup | Green |
| Completed | Dark Green |

---

### 🔴 Admin Interface (All pages — not started)

No admin pages exist. These need to be built as separate protected routes.

Install React Router and set up routing before building these.

Pages needed:

| Route | Page |
|-------|------|
| `/admin/login` | AdminLoginPage |
| `/admin/dashboard` | AdminDashboardPage |
| `/admin/quotes` | AdminQuotesPage |
| `/admin/appointments` | AdminAppointmentsPage |
| `/admin/work-orders` | AdminWorkOrdersPage |

Protected route wrapper: check for JWT in `localStorage`. Redirect to `/admin/login` if missing or expired.

Admin Login:
- Email + password form
- POST to `/api/auth/login`
- Store JWT in `localStorage` on success
- Redirect to `/admin/dashboard`

Admin Dashboard:
- Three stat cards: Total Quotes, Total Appointments, Active Work Orders
- Each card links to its respective admin table page

Admin Quotes Page:
- Table: ID, Customer Name, Phone, Vehicle, Tire Size, Qty, Tire Type, Status, Submitted At
- Data from GET `/api/admin/quotes`

Admin Appointments Page:
- Table: ID, Customer Name, Phone, Service Type, Date, Time, Vehicle, Status, Submitted At
- Data from GET `/api/admin/appointments`

Admin Work Orders Page:
- Table: Work Order #, Customer Name, Phone, Service Type, Status, Est. Completion, Staff Note, Actions
- Status dropdown in Actions column
- On status change: PUT `/api/admin/work-orders/{id}/status`
- Data from GET `/api/admin/work-orders`

---

## Routing Migration

The current app has **no router**. Before building admin pages or separate feature pages, install React Router and set up `AppRouter.tsx`.

Install: `npm install react-router-dom`

Route structure:

```
/                        → TireShopLandingPage (existing, with new sections added)
/admin/login             → AdminLoginPage (new)
/admin/dashboard         → AdminDashboardPage (new, protected)
/admin/quotes            → AdminQuotesPage (new, protected)
/admin/appointments      → AdminAppointmentsPage (new, protected)
/admin/work-orders       → AdminWorkOrdersPage (new, protected)
```

The three customer features (Get Quote, Schedule Appointment, Track Status) can remain as scroll sections on the main landing page rather than separate routes, keeping the current single-page structure intact.

---

## API Service Layer (Not Started)

Install Axios: `npm install axios`

Create `src/services/api.ts`:
- Axios instance with `baseURL` from env var `VITE_API_BASE_URL`
- Request interceptor: attach `Authorization: Bearer <token>` from `localStorage`
- Response interceptor: on 401, clear token and redirect to `/admin/login`

Create the following service files (see original guide for function signatures):
- `src/services/quoteService.ts`
- `src/services/appointmentService.ts`
- `src/services/workOrderService.ts`

---

## Google Integrations Status

| Integration | Status |
|-------------|--------|
| Google Maps embed | ✅ Already implemented in Contact section |
| Click-to-call (`tel:` link) | ✅ Already on Call Now button in Header and Hero |
| Google Business Profile link | ❌ Not added — add to Footer and Contact section |
| Google Analytics (GA4) | ❌ Not added — add GA4 script to `index.html` |
| Google Ads conversion tracking | ❌ Not added — add to `index.html`, fire on quote/appointment success |

---

## Environment Variables

Add `.env` file to project root:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_GA_TRACKING_ID=
VITE_GOOGLE_ADS_ID=
```

---

## Summary — Prioritized Task List

**Fix first (bugs / data):**
1. Fix `displayPhone` in `siteData.ts` → `"(601) 366-1886"`
2. Fix `hours` string typo in `siteData.ts`
3. Replace `services` array with the correct 8 services

**Color corrections:**
4. Update `Header.tsx` background to dark (`bg-neutral-950`), update text colors to white

**Complete existing components:**
5. Wire up `Booking.tsx` form — add state, validation, missing fields, Axios POST to `/api/appointments`

**Build new customer-facing features:**
6. Build Get Tire Quote section (`id="quote"`) with full form and API connection
7. Build Track Work Status section (`id="track-status"`) with search and result display

**Build admin interface:**
8. Install React Router, set up `AppRouter.tsx` and `ProtectedRoute.tsx`
9. Install Axios, set up `api.ts` service layer
10. Build AdminLoginPage with JWT flow
11. Build AdminDashboardPage
12. Build AdminQuotesPage
13. Build AdminAppointmentsPage
14. Build AdminWorkOrdersPage with status update

**Polish:**
15. Update Footer with nav links, address, Google Business Profile link
16. Add GA4 and Google Ads scripts to `index.html`
17. Add "Get Tire Quote" and "Track Status" buttons to Hero section
