# Project Phases

This document defines the implementation plan for the Order Management feature.

The project is divided into two small phases.

---

# Phase 1: Core Working Application

## Goal

Build the complete user flow from menu browsing to order placement and order status tracking.

The goal of Phase 1 is to make the application functional end-to-end.

---

## Scope

Phase 1 includes:

- Project setup
- Core TypeScript types
- In-memory data store
- Menu API
- Order API
- Order status API
- Menu UI
- Cart UI
- Checkout UI
- Order status page
- Simulated real-time status updates using polling

---

## 1. Project Setup

Set up the project with:

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Route Handlers
- Vitest
- React Testing Library

Recommended package manager:

```txt
pnpm
```

---

## 2. Core Folder Structure

Use the following structure:

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

## 3. Define Core Types

Create TypeScript types for:

- MenuItem
- CartItem
- CustomerDetails
- Order
- OrderStatus

Supported order statuses:

```txt
Order Received
Preparing
Out for Delivery
Delivered
```

---

## 4. Create In-Memory Store

Create an in-memory store inside:

```txt
src/lib/store.ts
```

The store should contain:

- Hardcoded menu items
- Created orders

The menu should have a small list of food items such as:

- Pizza
- Burger
- Pasta
- Fries
- Cold Coffee

Each menu item should include:

- id
- name
- description
- price
- image

---

## 5. Build REST API Routes

Implement the following endpoints:

```txt
GET /api/menu
POST /api/orders
GET /api/orders/:orderId
PATCH /api/orders/:orderId/status
```

### Required API Behavior

`GET /api/menu`

- Returns all menu items.

`POST /api/orders`

- Accepts cart items and customer details.
- Creates a new order.
- Stores the order in memory.
- Returns the created order.

`GET /api/orders/:orderId`

- Returns the order by ID.
- Returns 404 if the order does not exist.
- Also reflects simulated order status progression.

`PATCH /api/orders/:orderId/status`

- Updates order status.
- Returns 404 if the order does not exist.
- Returns validation error for invalid status.

---

## 6. Build Menu UI

The menu page should display all menu items.

Each item should show:

- Image
- Name
- Description
- Price
- Add to cart button

---

## 7. Build Cart UI

The cart should allow users to:

- View selected items
- Increase quantity
- Decrease quantity
- Remove item
- View total price
- Continue to checkout

---

## 8. Build Checkout UI

The checkout page should include fields for:

- Name
- Address
- Phone number

On submit:

- Create order using `POST /api/orders`
- Redirect user to `/orders/:orderId`

---

## 9. Build Order Status Page

The order status page should:

- Fetch order details using `GET /api/orders/:orderId`
- Display customer details
- Display ordered items
- Display current order status
- Poll the order endpoint every 2-3 seconds

---

## 10. Simulate Status Progression

Use this lifecycle:

```txt
Order Received → Preparing → Out for Delivery → Delivered
```

The status can be computed based on order creation time or updated internally by helper logic.

Recommended simple approach:

```txt
0-10 seconds       Order Received
10-20 seconds      Preparing
20-30 seconds      Out for Delivery
30+ seconds        Delivered
```

This keeps the backend simple and avoids timers that may behave unpredictably in serverless environments.

---

## Phase 1 Completion Criteria

Phase 1 is complete when:

- Menu items display on the homepage
- User can add items to cart
- User can change quantities
- User can proceed to checkout
- User can enter delivery details
- User can place an order
- User is redirected to the order status page
- Order status updates automatically using polling
- All core APIs work

---

# Phase 2: Validation, Tests, Documentation, Polish

## Goal

Make the project assessment-ready.

Phase 2 focuses on validation, tests, documentation, and final polish.

---

## Scope

Phase 2 includes:

- Zod validation
- API tests
- UI tests
- Improved error handling
- UI polish
- README documentation
- API documentation
- AGENTS.md
- Final cleanup

---

## 1. Add Zod Validation

Use Zod for validating:

- Create order request body
- Order item quantity
- Customer details
- Phone number
- Order status updates

Validation should reject:

- Empty cart
- Missing name
- Missing address
- Missing phone number
- Quantity less than 1
- Invalid menu item ID
- Invalid order status

---

## 2. Add API Tests

Test the following endpoints:

```txt
GET /api/menu
POST /api/orders
GET /api/orders/:orderId
PATCH /api/orders/:orderId/status
```

Required test cases:

- Menu returns food items
- Order can be created
- Order creation fails with empty cart
- Order creation fails with missing customer details
- Order creation fails with invalid menu item ID
- Order can be fetched by ID
- Invalid order ID returns 404
- Order status can be updated
- Invalid status update fails

---

## 3. Add UI Tests

Test key UI components:

- Menu item card renders name, description, price, and image
- Add to cart button works
- Quantity can be increased
- Quantity can be decreased
- Cart total updates correctly
- Checkout form renders required fields
- Checkout validation messages are shown
- Order status component displays the current status

---

## 4. Improve Error Handling

The UI should handle:

- Failed menu fetch
- Failed order creation
- Invalid checkout form
- Missing order
- Failed order status fetch

---

## 5. UI Polish

Keep the UI simple but clean.

Focus on:

- Clear layout
- Good spacing
- Readable typography
- Clear buttons
- Mobile-friendly design
- Visible cart summary
- Clear order status progress display

Avoid unnecessary UI complexity.

---

## 6. Documentation

Create and maintain:

```txt
README.md
Phases.md
AGENTS.md
API.md
```

`README.md` should explain:

- Project overview
- Tech stack
- Setup instructions
- Available scripts
- Architecture decisions
- Testing approach
- Known limitations
- Future improvements

`Phases.md` should explain:

- Phase 1 plan
- Phase 2 plan
- Completion criteria

`AGENTS.md` should explain:

- Coding assistant rules
- Project context
- Commands
- Scope boundaries
- Where to find detailed docs

`API.md` should explain:

- Data models
- API endpoints
- Request shapes
- Response shapes
- Validation rules
- Error responses

---

## 7. Final Cleanup

Before submission:

- Run all tests
- Run linting
- Run production build
- Manually test complete user flow
- Remove unused code
- Confirm documentation is accurate

---

# Future Phase: Database Migration

After the whole application is complete with in-memory storage, migrate to a real database.

Recommended future stack:

- Prisma
- SQLite for local development
- PostgreSQL for production

The goal of the future phase is to replace the in-memory store without changing the UI flow.

Possible models:

- MenuItem
- Order
- OrderItem
- CustomerDetails

---

# Enhancement: Revisitable Orders

Add a lightweight recent-orders experience on the homepage.

Use browser `localStorage` to persist a small list of recent order references so users can return to `/orders/:orderId` from the navbar after leaving the status page.

This enhancement should:

- Save recent order IDs after successful order placement
- Show recent order links and totals in the navbar order-history dropdown
- Keep completed orders revisitable
- Continue using the existing in-memory backend store for full order details

This is intentionally left out of the first implementation because the assessment allows in-memory storage and the first priority is a clean working feature.
