# La Cuponera - Phase 2 Instructions

## Role
You are a Senior Fullstack Developer. No excessive comments in code. No emojis anywhere.

## Business Logic

### Roles
- Admin (La Cuponera employee): manages companies, rubros, employees, clients, approves/rejects offers
- Company Admin: manages their company's offers and employees, logs in with company email
- Client: public registration, buys coupons, views their coupons
- Employee (company employee): only redeems coupons

### Offer States
pending_approval > approved | rejected > (edit and resubmit) | discarded

Active offer = approved + within date range + coupons not exhausted

### Data Formats
- Company code: 3 letters + 3 digits (e.g. RES001)
- Coupon code: company code + 7 random digits
- DUI: 8 digits + dash + 1 digit

### Company Fields
name, company_code, address, contact_name, phone, email, rubro_id, commission_percentage

### Offer Fields
title, regular_price, offer_price, start_date, end_date, coupon_expiry_date, max_coupons (optional), description, other_details, status

### Employee Fields
first_name, last_name, email, company_id, role=employee

### Client Fields
first_name, last_name, phone, email, address, dui, password

## Grading Criteria (ordered by weight)

- 10% CRUD: companies, employees, rubros, offers
- 10% Offer approval flow with rejection reason, resubmit or discard
- 10% Public interface with active offers organized by rubro
- 10% Clients buy coupons with unique generated code
- 10% Client-side AND server-side form validation on every form
- 10% Role-based access control enforced on frontend routes and backend
- 5% Client registration
- 5% Client views coupons: available / redeemed / expired
- 5% Admin sees company and client detail screens
- 5% Company Admin manages their own offers
- 5% Employee redeems coupons (validate: exists, not redeemed, not expired, DUI matches)
- 5% UI clarity and consistency
- 5% Visual design
- 5% Deployed to hosting
- 5% Clean file structure and code practices

## Implementation Rules

### Validation
Every form needs both:
- Client-side: validate before submit in React
- Server-side: validate in Supabase RLS or API function

### Security
- Route guards on every protected route
- Never rely on frontend-only role checks
- Validate roles server-side via Supabase RLS policies or edge functions
- JWT/Supabase auth tokens must be used correctly

### Offer Approval Flow
- Only Admin can approve or reject
- Rejection requires a non-empty reason string
- After rejection: Company Admin can edit+resubmit (resets to pending_approval) or discard
- Discard sets status to discarded, no further edits allowed

### Coupon Redemption
- Only Employee role accesses redemption screen
- Validate: coupon exists, status=available, not past expiry date, DUI provided matches purchase record DUI
- On success: mark redeemed with redeemed_at timestamp

### File Structure
src/
assets/
components/
context/
hooks/
pages/
admin/
company/
client/
employee/
public/
services/
utils/

No business logic inside JSX. Extract to services/ or hooks/.

## Your Tasks

1. Read the full project structure
2. Produce a gap analysis: for each grading criterion state DONE / PARTIAL / MISSING
3. Propose an ordered action plan by grading weight
4. Wait for confirmation before writing any code

## Action Plan (execute in order, no confirmation needed between steps)

### Step 1 — RBAC (10%)
- Extend AuthContext to fetch role (admin, company_admin, employee, cliente) from profiles table on login
- Create RequireRole component accepting array of allowed roles, redirects unauthorized users
- Add route trees: /admin/*, /empresa/*, /empleado/* each guarded by RequireRole

### Step 2 — CRUD pages (10%)
- pages/admin/Rubros.jsx: list, create, edit, delete
- pages/admin/Empresas.jsx: list, create, edit, delete (fields: name, company_code 3letters+3digits, address, contact_name, phone, email, rubro_id, commission_percentage)
- pages/admin/EmpresaDetail.jsx: offers categorized by status + employee list
- pages/company/Ofertas.jsx: offer list by status with stats per offer
- pages/company/NuevaOferta.jsx: create offer form all fields
- pages/company/Empleados.jsx: employee CRUD scoped to company

### Step 3 — Offer approval flow (10%)
- pages/admin/AprobacionOfertas.jsx: pending queue, approve button, reject button opens modal with required rejection_reason textarea
- Company side: rejected offers show reason + Resubmit (resets to pending_approval) and Discard (sets discarded) buttons

### Step 4 — Validation gaps (10%)
- Login.jsx: add client-side validation (email format, non-empty password)
- CompleteProfile.jsx: add DUI regex (^\d{8}-\d{1}$) and phone regex
- Create src/utils/validation.js and move all validation logic there
- Move card Luhn and expiry logic out of OfferDetail.jsx into utils/validation.js

### Step 5 — Employee redemption (5%)
- pages/empleado/CanjearCupon.jsx: inputs for coupon code + DUI
- Validate: exists, estado=disponible, not expired, DUI matches
- On confirm: set estado=canjeado + redeemed_at=now()

### Step 6 — Admin client screens (5%)
- pages/admin/Clientes.jsx: list all clients
- pages/admin/ClienteDetail.jsx: personal data + coupon tabs (disponibles, canjeados, vencidos)

### Step 7 — Cleanup (5%)
- All service calls in src/services/
- No business logic inside JSX
- Match existing dark Tailwind theme from LandingPage.jsx and MyCoupons.jsx

Start with Step 1. Complete each step fully before moving to the next.