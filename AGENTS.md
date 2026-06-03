# AGENTS.md

## Project Summary

This project is an Order Management feature for a food delivery app.

It allows users to:

- View menu items
- Add items to a cart
- Change quantities
- Enter delivery details
- Place an order
- Track order status

The project is for a Sr Full Stack Developer assessment.

---

## Tech Stack

Use:

- Next.js
- TypeScript
- Tailwind CSS
- Next.js Route Handlers
- Vitest
- React Testing Library
- Zod
- In-memory store

Package manager:

```txt
pnpm
```

---

## Current Storage Decision

Use an in-memory store for now.

Do not add Prisma or a database in the first implementation.

The project may later migrate to Prisma + SQLite/Postgres after the full application is complete.

---

## Order Status Lifecycle

Use these statuses:

```txt
Order Received
Preparing
Out for Delivery
Delivered
```

Status updates should be simulated.

Use polling from the frontend instead of WebSockets.

---

## Documentation Files

Use these files:

```txt
README.md       Human-facing project documentation
Phases.md       Implementation plan
AGENTS.md       Coding assistant instructions
docs/API.md     API contracts and data models
```

Keep detailed API contracts and data models in:

```txt
docs/API.md
```

Do not overload this file with long endpoint documentation.

---

## Main Commands

Install dependencies:

```bash
pnpm install
```

Run dev server:

```bash
pnpm dev
```

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run lint:

```bash
pnpm lint
```

Build:

```bash
pnpm build
```

---

## Expected Folder Structure

```txt
src/
  app/
    page.tsx
    checkout/
      page.tsx
    orders/
      [orderId]/
        page.tsx

    api/
      menu/
        route.ts
      orders/
        route.ts
      orders/
        [orderId]/
          route.ts
      orders/
        [orderId]/
          status/
            route.ts

  components/
    menu/
    cart/
    checkout/
    order-status/

  lib/
    store.ts
    types.ts
    validation.ts
    status.ts
```

---

## Code Style Rules

- Use TypeScript everywhere.
- Keep types in `src/lib/types.ts`.
- Keep validation schemas in `src/lib/validation.ts`.
- Keep in-memory data logic in `src/lib/store.ts`.
- Keep order status progression logic in `src/lib/status.ts`.
- Keep components small and focused.
- Prefer readable code over clever abstractions.
- Do not overengineer the assessment.

---

## API Rules

Use REST APIs through Next.js Route Handlers.

Required endpoints:

```txt
GET /api/menu
POST /api/orders
GET /api/orders/:orderId
PATCH /api/orders/:orderId/status
```

Follow the contract in:

```txt
docs/API.md
```

---

## Testing Rules

Use Vitest and React Testing Library.

Tests should cover:

- API endpoints
- Order creation
- Input validation
- Invalid requests
- Order status updates
- Key UI components

Do not skip tests for core order flow.

---

## Scope Boundaries

Do not add unless explicitly requested:

- Authentication
- Payment system
- Admin dashboard
- Database
- Prisma
- WebSockets
- External state management libraries
- Complex UI libraries

The assessment asks for a simple functional order management feature. Keep the implementation focused on that.

---

## Implementation Priority

Build in this order:

1. Types
2. In-memory store
3. API routes
4. Menu UI
5. Cart UI
6. Checkout UI
7. Order status UI
8. Polling
9. Zod validation
10. Tests
11. Documentation cleanup
