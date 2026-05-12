# Putnam Tire — Frontend Implementation Guide

## Overview

Build the public-facing website and admin interface for Putnam Tire using React + TypeScript + Tailwind CSS + Vite. The UI must be clean, professional, mobile-responsive, and focused on three core customer actions: Get Tire Quote, Schedule Appointment, and Check Work Status.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend API |

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#CC0000` | Buttons, CTAs, accents |
| `--color-dark` | `#111111` | Navbar, footer, headings |
| `--color-white` | `#FFFFFF` | Backgrounds, card surfaces |
| `--color-gray-light` | `#F5F5F5` | Section backgrounds |
| `--color-gray-mid` | `#9CA3AF` | Placeholder text, borders |

---

## Folder Structure

```
src/
├── assets/                  # Images, icons, logo
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── InputField.tsx
│   │   ├── SelectField.tsx
│   │   ├── TextareaField.tsx
│   │   └── StatusBadge.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── ServicesOverview.tsx
│       ├── GallerySection.tsx
│       ├── CtaSection.tsx
│       └── ContactSection.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── GetQuotePage.tsx
│   ├── ScheduleAppointmentPage.tsx
│   ├── TrackStatusPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── admin/
│       ├── AdminLoginPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── AdminQuotesPage.tsx
│       ├── AdminAppointmentsPage.tsx
│       └── AdminWorkOrdersPage.tsx
├── routes/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx
├── services/
│   ├── api.ts               # Axios instance + base URL config
│   ├── quoteService.ts
│   ├── appointmentService.ts
│   └── workOrderService.ts
├── types/
│   ├── quote.types.ts
│   ├── appointment.types.ts
│   └── workOrder.types.ts
├── utils/
│   └── formatters.ts        # Date, phone, status label helpers
└── App.tsx
```

---

## Routing

### Public Routes

| Path | Page |
|------|------|
| `/` | HomePage |
| `/services` | ServicesPage |
| `/get-quote` | GetQuotePage |
| `/schedule` | ScheduleAppointmentPage |
| `/track-status` | TrackStatusPage |
| `/about` | AboutPage |
| `/contact` | ContactPage |

### Admin Routes (protected — require valid JWT)

| Path | Page |
|------|------|
| `/admin/login` | AdminLoginPage |
| `/admin/dashboard` | AdminDashboardPage |
| `/admin/quotes` | AdminQuotesPage |
| `/admin/appointments` | AdminAppointmentsPage |
| `/admin/work-orders` | AdminWorkOrdersPage |

`ProtectedRoute.tsx` checks for a valid JWT token in `localStorage`. If absent or expired, redirect to `/admin/login`.

---

## Pages

### HomePage

Sections in order:

1. **HeroSection** — Full-width banner with business name, tagline, and three CTA buttons: "Get Tire Quote", "Schedule Appointment", "Track Status"
2. **ServicesOverview** — Grid of service cards listing all 8 services
3. **GallerySection** — Tire shop photo grid (static images from `assets/`)
4. **CtaSection** — Bold call-to-action banner with "Call Now" button linking to `tel:(601)366-1886`
5. **ContactSection** — Address, phone, Google Maps embed, business hours

---

### ServicesPage

Static page listing all services:
- New Tire Sales
- Tire Installation
- Flat Tire Repair
- Tire Replacement
- Wheel Balancing
- Wheel Alignment
- Rim Repair
- Truck & SUV Tires

Each service rendered as a card with icon, title, and short description.

---

### GetQuotePage

Form with the following fields:

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

**Tire Type Select Options:** Budget, Mid-range, Premium, Not sure

On submit: POST to `/api/quotes`. Show success message on completion. Show error message on failure. Disable submit button while request is in flight.

---

### ScheduleAppointmentPage

Form with the following fields:

| Field | Input Type | Required |
|-------|------------|----------|
| Full Name | Text | Yes |
| Phone Number | Tel | Yes |
| Email | Email | Yes |
| Service Type | Select | Yes |
| Preferred Date | Date | Yes |
| Preferred Time | Time | Yes |
| Vehicle Details | Text | Yes |
| Additional Notes | Textarea | No |

**Service Type Select Options:** Tire Installation, Flat Tire Repair, Tire Replacement, Wheel Balancing, Wheel Alignment, Rim Repair

On submit: POST to `/api/appointments`. Show success message on completion. Show error message on failure.

---

### TrackStatusPage

Two search modes — toggled by a tab or radio selector:

**Mode 1 — Search by Phone Number**
- Phone number text input
- Submit button

**Mode 2 — Search by Work Order Number**
- Work order number text input
- Submit button

On submit: GET `/api/work-orders/status` with either query param `phone` or `workOrderNumber`.

**Result display fields:**
- Work Order Number
- Service Type
- Current Status (rendered as `StatusBadge`)
- Estimated Completion Time
- Staff Note (if present)

**Status badge color mapping:**

| Status | Badge Color |
|--------|-------------|
| Request Received | Gray |
| Appointment Confirmed | Blue |
| Vehicle Received | Yellow |
| Work In Progress | Orange |
| Waiting for Tires | Purple |
| Ready for Pickup | Green |
| Completed | Dark Green |

If no result found, display a clear "No work order found" message.

---

### AboutPage

Static page with:
- Business name and short description
- Address: 4879 N State St, Jackson, MS 39206
- Phone: (601) 366-1886
- Google Maps embed
- Google Business Profile link

---

### ContactPage

Static page with:
- Address and phone
- Click-to-call button: `href="tel:+16013661886"`
- Google Maps embed
- Business hours (placeholder until provided by client)

---

### AdminLoginPage

Login form:
- Email input
- Password input
- Login button

On submit: POST to `/api/auth/login`. On success, store JWT in `localStorage` and redirect to `/admin/dashboard`. On failure, show error message.

---

### AdminDashboardPage

Three summary stat cards:
- Total Quote Requests → links to `/admin/quotes`
- Total Appointments → links to `/admin/appointments`
- Active Work Orders → links to `/admin/work-orders`

---

### AdminQuotesPage

Paginated table of all quote requests.

Columns: ID, Customer Name, Phone, Vehicle, Tire Size, Qty, Tire Type, Status, Submitted At

Data source: GET `/api/admin/quotes`

---

### AdminAppointmentsPage

Paginated table of all appointment requests.

Columns: ID, Customer Name, Phone, Service Type, Date, Time, Vehicle, Status, Submitted At

Data source: GET `/api/admin/appointments`

---

### AdminWorkOrdersPage

Paginated table of all work orders.

Columns: Work Order #, Customer Name, Phone, Service Type, Status, Est. Completion, Staff Note, Actions

**Actions column:** Status dropdown. On change: PUT `/api/admin/work-orders/{id}/status`

Data source: GET `/api/admin/work-orders`

---

## API Service Layer

### `api.ts`
- Single Axios instance with `baseURL` from env variable `VITE_API_BASE_URL`
- Attach JWT from `localStorage` to every request as `Authorization: Bearer <token>`
- Global 401 interceptor: clear token and redirect to `/admin/login`

### `quoteService.ts`
- `submitQuote(data: QuoteRequestPayload): Promise<void>` → POST `/api/quotes`

### `appointmentService.ts`
- `submitAppointment(data: AppointmentPayload): Promise<void>` → POST `/api/appointments`

### `workOrderService.ts`
- `checkStatus(params: { phone?: string; workOrderNumber?: string }): Promise<WorkOrderStatus>` → GET `/api/work-orders/status`
- `getAllWorkOrders(): Promise<WorkOrder[]>` → GET `/api/admin/work-orders`
- `updateStatus(id: number, status: string): Promise<void>` → PUT `/api/admin/work-orders/{id}/status`

---

## TypeScript Types

### `quote.types.ts`

```
QuoteRequestPayload {
  fullName: string
  phone: string
  email: string
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
  tireSize: string
  quantity: number
  preferredTireType: 'BUDGET' | 'MID_RANGE' | 'PREMIUM' | 'NOT_SURE'
  message?: string
}
```

### `appointment.types.ts`

```
AppointmentPayload {
  fullName: string
  phone: string
  email: string
  serviceType: string
  preferredDate: string        // ISO date string YYYY-MM-DD
  preferredTime: string        // HH:mm format
  vehicleDetails: string
  notes?: string
}
```

### `workOrder.types.ts`

```
WorkOrderStatus {
  workOrderNumber: string
  serviceType: string
  status: string
  estimatedCompletionTime?: string
  staffNote?: string
  customerName: string
}

WorkOrder {
  id: number
  workOrderNumber: string
  customerName: string
  phone: string
  serviceType: string
  status: string
  estimatedCompletionTime?: string
  staffNote?: string
}
```

---

## Google Integrations

| Integration | Implementation |
|-------------|---------------|
| Google Maps | Embed `<iframe>` on ContactPage, AboutPage, and HomePage ContactSection |
| Click-to-call | All "Call Now" buttons use `href="tel:+16013661886"` |
| Google Business Profile | Static link in Footer and AboutPage |
| Google Analytics (GA4) | GA4 `<script>` tag in `index.html`; tracking ID supplied by client |
| Google Ads Conversion Tracking | Conversion snippet in `index.html`; fire event on successful quote and appointment form submissions |

---

## Navbar

- Logo / business name on the left
- Navigation links: Home, Services, Get Quote, Schedule, Track Status, About, Contact
- "Call Now" CTA button on the right (click-to-call)
- Mobile: hamburger menu that collapses all links into a dropdown

---

## Footer

- Business name, address, phone number
- Quick links to all public pages
- Google Business Profile link
- Copyright line

---

## Environment Variables (`.env`)

```
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=
VITE_GA_TRACKING_ID=
VITE_GOOGLE_ADS_ID=
```

---

## Acceptance Checklist

- [ ] All 7 public pages render correctly
- [ ] All 5 admin pages render correctly and are route-protected
- [ ] Quote form submits and shows success/error feedback
- [ ] Appointment form submits and shows success/error feedback
- [ ] Track Status search works by both phone and work order number
- [ ] Status result displays correctly with colored badge
- [ ] Admin login stores JWT and redirects to dashboard
- [ ] Admin can update work order status
- [ ] Unauthenticated admin routes redirect to `/admin/login`
- [ ] All pages are mobile responsive
- [ ] Google Maps embeds load correctly
- [ ] Click-to-call works on mobile
- [ ] Build passes with zero TypeScript errors
