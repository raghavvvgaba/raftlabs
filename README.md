# Order Management Feature - Food Delivery App

## Project Overview

This project is a small Order Management feature for a food delivery application.

It allows users to:

- View a menu of food items
- Add items to a cart
- Update item quantities
- Enter delivery details
- Place an order
- Track the order status
- See simulated real-time order status updates

The project is built as part of a Sr Full Stack Developer assessment.

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Next.js Route Handlers
- In-memory data store
- Vitest
- React Testing Library
- Zod

---

## Core Features

### Menu Display

Users can view a list of food items. Each food item includes:

- Name
- Description
- Price
- Image
- Veg or non-veg indicator

### Cart

Users can:

- Add items to the cart
- Increase item quantity
- Decrease item quantity
- Remove items from the cart
- View the cart total

### Checkout

Users can enter delivery details:

- Name
- Address
- Phone number

After submitting the checkout form, an order is created.

### Order Status Tracking

After placing an order, users are redirected to an order status page.

Supported order statuses:

1. Order Received
2. Preparing
3. Out for Delivery
4. Delivered

The status update is simulated by the backend. The frontend polls the order endpoint every 3 seconds to fetch the latest status.

---

## Real-Time Update Approach

This project uses lightweight polling for simulated real-time order status updates.

The order status page periodically calls:

```txt
GET /api/orders/:orderId
```

This keeps the implementation simple, reliable, and appropriate for the assessment.

WebSockets were intentionally not used because the feature only requires one-way status updates from the server to the client. For a production-scale system, this could later be replaced with Server-Sent Events or WebSockets depending on the real-time requirements.

---

## Architecture Decisions

### 1. Next.js Instead of Separate React + Express Apps

Next.js was chosen because the assessment requires both a frontend UI and REST API endpoints.

Using Next.js allows the UI and backend route handlers to live in one TypeScript codebase. This keeps the project simple while still demonstrating full-stack development.

### 2. Route Handlers for REST API

Next.js Route Handlers are used for API endpoints such as:

- Menu retrieval
- Order creation
- Order lookup
- Order status updates

### 3. In-Memory Store First

The assessment allows in-memory storage or a simple database.

This project starts with an in-memory store to keep the first implementation focused and fast. The storage layer is kept separate so it can later be replaced with Prisma and a database.

### 4. Zod for Validation

Zod is used for request validation in API routes.

Validation covers:

- Empty cart
- Invalid quantity
- Missing customer details
- Invalid phone number; phone numbers must be exactly 10 digits
- Invalid order status
- Invalid menu item IDs

### 5. Testing

The project uses:

- Vitest for unit and API-level tests
- React Testing Library for UI component tests

Tests cover:

- API endpoints
- Order creation
- Input validation
- Order status updates
- Key UI components

---

## Project Structure

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
      MenuItemCard.tsx
      MenuList.tsx

    cart/
      Cart.tsx
      CartItem.tsx

    checkout/
      CheckoutForm.tsx

    order-status/
      OrderStatusTracker.tsx

  lib/
    store.ts
    types.ts
    validation.ts
    status.ts
```

---

## API Documentation

Detailed API contracts and data models are documented in:

```txt
API.md
```

---

## Development Phases

The implementation plan is documented in:

```txt
Phases.md
```

---

## Coding Agent Instructions

Coding assistant instructions are documented in:

```txt
AGENTS.md
```

---

## Setup Instructions

Install dependencies:

```bash
pnpm install
```

Run development server:

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

Run linting:

```bash
pnpm lint
```

Build project:

```bash
pnpm build
```

---

## Available Scripts

```txt
pnpm dev        Start the development server
pnpm build      Build the application
pnpm start      Start the production server
pnpm lint       Run linting
pnpm test       Run tests
pnpm test:watch Run tests in watch mode
```

---

## Known Limitations

- Data is stored in memory, so orders reset when the server restarts.
- Authentication is not included because the assessment does not ask for it.
- Payments are not included because the assessment does not ask for it.
- Admin dashboard is not included because the assessment only asks for order placement and status updates.
- Real-time updates are simulated using polling instead of WebSockets.

---

## Future Improvements

After the core feature is complete, the in-memory store can be replaced with:

- Prisma
- SQLite for local development
- PostgreSQL for production

Possible future improvements:

- Persist orders in a database
- Add authentication
- Add admin order management UI
- Replace polling with Server-Sent Events or WebSockets
- Add payment flow
- Add order history
- Add deployment configuration
