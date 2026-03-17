# Plan: Real Estate CRM — Full Build Roadmap

**TL;DR**: Build a full-stack real estate CRM on top of the existing Hono + React/TanStack monorepo. Work phase-by-phase — foundation first (DB + auth), then the 3 core CRM modules (Contacts, Properties, Deals), then a dashboard to tie it together. Backend and frontend for each module are built together before moving to the next.

---

### Phase 1 — Foundation: Database + Auth
*Everything else depends on this phase.*

**Step 1 — Install & configure Drizzle ORM with PostgreSQL**
- Add `drizzle-orm`, `drizzle-kit`, `pg` (or `postgres`) to `apps/api`
- Create `apps/api/src/db/index.ts` — connection pool, exports `db`
- Create `apps/api/src/db/schema.ts` — initial schema file
- Add `.env` to `apps/api` with `DATABASE_URL`
- Add `drizzle.config.ts` for migrations CLI

**Step 2 — Define `users` + `sessions` schema**
- `users` table: `id`, `email`, `passwordHash`, `name`, `role`, `createdAt`
- Generate and run first migration (`drizzle-kit push` or `generate + migrate`)

**Step 3 — Auth API endpoints in Hono**
- `POST /auth/register` — hash password (bcrypt), insert user, return JWT
- `POST /auth/login` — verify credentials, sign JWT (30d expiry)
- `GET /auth/me` — protected, returns current user from token
- Create `apps/api/src/middleware/auth.ts` — JWT verification middleware
- Use Hono's typed route chaining for full end-to-end type safety with the frontend client

**Step 4 — Auth UI pages**
- Install shadcn/ui components: `Button`, `Input`, `Form`, `Card`, `Label`
- Create route `apps/web/src/routes/login.tsx` — email/password form, stores JWT in localStorage, redirects to dashboard
- Create route `apps/web/src/routes/register.tsx`
- Create `apps/web/src/lib/auth.ts` — `getToken()`, `setToken()`, `clearToken()` helpers
- Add auth header injection to `apps/web/src/lib/api.ts`

**Step 5 — Route protection**
- Add `beforeLoad` auth guard in TanStack Router on the root layout for protected routes
- Redirect unauthenticated users to `/login`
- Expose current user via TanStack Query (`useCurrentUser` hook)

---

### Phase 2 — App Shell & Navigation
*Parallel with Phase 1 backend work — no hard dependency.*

**Step 6 — Sidebar layout**
- Create `apps/web/src/components/layout/AppShell.tsx` — sidebar + topbar + main content area
- Sidebar links: Dashboard, Contacts, Properties, Deals
- Active link highlighting, user avatar + logout button in sidebar footer
- Mobile-responsive (collapsible sidebar on small screens)
- Install shadcn/ui: `Separator`, `Avatar`, `Tooltip`

**Step 7 — Wrap protected routes in layout**
- Create a route group (e.g., `_authenticated.tsx`) in TanStack Router that nests protected pages inside `AppShell`

---

### Phase 3 — Contacts & Leads Module
*Depends on Phase 1 complete.*

**Step 8 — Contacts schema + API**
- Schema: `contacts` — `id`, `name`, `email`, `phone`, `type` (lead/client/vendor), `source`, `notes`, `assignedTo` (FK to users), `createdAt`
- API routes under `/contacts`: `GET /` (list + search + filter), `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`
- Use Drizzle query builder with pagination (limit/offset)

**Step 9 — Contacts list page**
- Route: `apps/web/src/routes/_authenticated/contacts/index.tsx`
- TanStack Query hook: `useContacts({ search, type, page })`
- shadcn/ui `DataTable` (with `@tanstack/react-table`) — columns: name, email, phone, type, source, assigned agent
- Search input, type filter dropdown, pagination
- "Add Contact" button → opens create modal

**Step 10 — Contact detail page**
- Route: `apps/web/src/routes/_authenticated/contacts/$contactId.tsx`
- Shows full contact card, notes section, activity timeline (what deals/properties linked)
- Inline edit or edit modal

---

### Phase 4 — Properties Module
*Depends on Phase 1 complete. Parallel with Phase 3.*

**Step 11 — Properties schema + API**
- Schema: `properties` — `id`, `address`, `city`, `price`, `status` (available/under-contract/sold/off-market), `type` (residential/commercial), `bedrooms`, `bathrooms`, `sqft`, `description`, `images` (JSON array of URLs), `listedBy` (FK to users), `createdAt`
- API routes under `/properties`: full CRUD + list with filters

**Step 12 — Properties list page**
- Route: `apps/web/src/routes/_authenticated/properties/index.tsx`
- Grid/table view toggle (grid shows property cards with image, price, status badge; table shows dense list)
- Filters: status, type, price range
- Status badge colors: green=available, yellow=under-contract, blue=sold

**Step 13 — Property detail page**
- Route: `apps/web/src/routes/_authenticated/properties/$propertyId.tsx`
- Image carousel (shadcn/ui `Carousel`), full details, status management
- Linked deals and contacts shown at bottom

---

### Phase 5 — Deal Pipeline (Kanban)
*Depends on Phase 3 + 4 (contacts/properties must exist to link to deals).*

**Step 14 — Deals schema + API**
- Schema: `deals` — `id`, `title`, `stage` (lead/qualified/offer/under-contract/closed-won/closed-lost), `value`, `contactId` (FK), `propertyId` (FK, optional), `assignedTo` (FK), `closeDate`, `notes`, `createdAt`
- API: full CRUD + `PATCH /:id/stage` for moving between pipeline stages

**Step 15 — Kanban board page**
- Route: `apps/web/src/routes/_authenticated/deals/index.tsx`
- Install `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop
- Columns = pipeline stages, each column shows deal cards
- Drag a card → optimistic update via TanStack Query → `PATCH /deals/:id/stage`
- Deal card shows: title, contact name, property address, deal value, close date

**Step 16 — Deal detail drawer/modal**
- Slide-out drawer (shadcn/ui `Sheet`) showing full deal info
- Edit deal form inline, link/unlink contacts and properties

---

### Phase 6 — Dashboard
*Depends on all modules. Build last.*

**Step 17 — Dashboard stats API**
- `GET /dashboard/stats` — returns: total contacts, open deals, total deal value, properties by status
- Efficient aggregation queries in Drizzle

**Step 18 — Dashboard page**
- Route: `apps/web/src/routes/_authenticated/index.tsx`
- Summary cards: Contacts, Open Deals, Pipeline Value, Properties Available
- Recent activity list (last 10 contacts/deals created)
- Install shadcn/ui `Card`, `Badge`; optionally add a simple chart with `recharts` for deal pipeline breakdown

---

### Key Files Reference

| File | Purpose |
|---|---|
| `apps/api/src/index.ts` | Add all Hono route registrations here |
| `apps/web/src/lib/api.ts` | Hono RPC client — extend as new endpoints are added |
| `apps/web/src/router.tsx` | TanStack Router config — add auth context |
| `apps/web/src/routes/__root.tsx` | Root layout — QueryClient + auth provider wiring |
| `apps/web/src/styles.css` | Design tokens already defined (sea-ink, lagoon, palm, sand, foam) |

---

### Verification (per phase)

1. **Phase 1**: `POST /auth/login` returns JWT; protected route redirects to `/login` when no token; `GET /auth/me` returns user with valid token
2. **Phase 2**: Sidebar renders on all protected pages; collapses on mobile; logout clears token
3. **Phase 3**: Contacts table shows with search + filter; create/edit/delete persists to DB
4. **Phase 4**: Property grid + table toggle works; status badge updates correctly
5. **Phase 5**: Drag card between Kanban columns → DB stage updates; optimistic UI reflects instantly
6. **Phase 6**: Dashboard stats reflect real DB counts; updates when data changes

---

### Decisions

- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Email/Password with JWT (stored in localStorage)
- **Features in scope**: Contacts, Properties, Deal Kanban board, Dashboard
- **Features excluded**: Calendar/Appointments, Document storage, Analytics charts (beyond Phase 6 summary cards)
- **Drag-and-drop**: `@dnd-kit` (lighter and more modern than `react-beautiful-dnd`)
- **Tables**: `@tanstack/react-table` (already in the ecosystem, pairs perfectly with TanStack Query)

---

### Further Considerations

1. **Image uploads for Properties**: Do you want actual file upload (needs S3/Cloudflare R2) or just paste image URLs for now? Starting with URLs is much simpler.
2. **Multi-agent vs single-user**: Should agents only see their own contacts/deals, or can admins see everything? This affects the auth middleware and query filters.
