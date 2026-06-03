# API Documentation

This document defines the data models, API endpoints, request bodies, response shapes, validation rules, and error responses for the Order Management feature.

---

# Data Models

## MenuItem

```ts
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  foodType: "veg" | "non-veg";
};
```

### Notes

- `id` should be unique.
- `price` should be stored as a number.
- `image` can be a local image path or public image URL.
- `foodType` indicates whether the item is vegetarian or non-vegetarian for UI badges/icons.

---

## CartItem

```ts
export type CartItem = {
  menuItemId: string;
  quantity: number;
};
```

### Notes

- `menuItemId` must match an existing menu item.
- `quantity` must be at least `1`.

---

## CustomerDetails

```ts
export type CustomerDetails = {
  name: string;
  address: string;
  phone: string;
};
```

### Notes

- `name` is required.
- `address` is required.
- `phone` is required.
- Phone validation can be simple for this assessment.

---

## OrderStatus

```ts
export type OrderStatus =
  | "Order Received"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered";
```

---

## OrderItem

```ts
export type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};
```

### Notes

Order items should copy the menu item name and price at the time of order creation.

This prevents old orders from changing if menu prices are updated later.

---

## Order

```ts
export type Order = {
  id: string;
  items: OrderItem[];
  customer: CustomerDetails;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
};
```

---

# In-Memory Store

The in-memory store should contain:

```ts
type Store = {
  menuItems: MenuItem[];
  orders: Order[];
};
```

Recommended file:

```txt
src/lib/store.ts
```

The store should expose helper functions such as:

```ts
getMenuItems(): MenuItem[];

getMenuItemById(id: string): MenuItem | undefined;

createOrder(input: CreateOrderInput): Order;

getOrderById(id: string): Order | undefined;

updateOrderStatus(id: string, status: OrderStatus): Order | undefined;
```

---

# Status Progression

The order status lifecycle is:

```txt
Order Received → Preparing → Out for Delivery → Delivered
```

Recommended simulated timing:

```txt
0-10 seconds       Order Received
10-20 seconds      Preparing
20-30 seconds      Out for Delivery
30+ seconds        Delivered
```

The backend can compute the current status based on `createdAt`.

Recommended helper:

```ts
getSimulatedOrderStatus(createdAt: string): OrderStatus;
```

This avoids needing background jobs or server timers.

---

# API Endpoints

---

## 1. Get Menu Items

```txt
GET /api/menu
```

### Description

Returns all available menu items.

### Response: 200

```json
{
  "items": [
    {
      "id": "pizza-margherita",
      "name": "Margherita Pizza",
      "description": "Classic cheese pizza with tomato sauce and fresh basil.",
      "price": 299,
      "image": "/menu/pizza-margherita.svg",
      "foodType": "veg"
    }
  ]
}
```

### Error Responses

This endpoint should usually not fail unless there is an unexpected server error.

```json
{
  "error": "Failed to fetch menu items"
}
```

---

## 2. Create Order

```txt
POST /api/orders
```

### Description

Creates a new order using cart items and customer delivery details.

### Request Body

```json
{
  "items": [
    {
      "menuItemId": "pizza-margherita",
      "quantity": 2
    }
  ],
  "customer": {
    "name": "Raghav",
    "address": "123 Main Street",
    "phone": "9876543210"
  }
}
```

### Validation Rules

- `items` is required.
- `items` cannot be empty.
- `menuItemId` is required.
- `menuItemId` must exist in the menu.
- `quantity` must be at least `1`.
- `customer.name` is required.
- `customer.address` is required.
- `customer.phone` is required.

### Response: 201

```json
{
  "order": {
    "id": "order_123",
    "items": [
      {
        "menuItemId": "pizza-margherita",
        "name": "Margherita Pizza",
        "price": 299,
        "quantity": 2
      }
    ],
    "customer": {
      "name": "Raghav",
      "address": "123 Main Street",
      "phone": "9876543210"
    },
    "status": "Order Received",
    "total": 598,
    "createdAt": "2026-06-03T10:00:00.000Z",
    "updatedAt": "2026-06-03T10:00:00.000Z"
  }
}
```

### Error: 400

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "field": "items",
      "message": "Cart cannot be empty"
    }
  ]
}
```

### Error: 400 for Invalid Menu Item

```json
{
  "error": "Invalid menu item",
  "message": "One or more menu items do not exist"
}
```

---

## 3. Get Order By ID

```txt
GET /api/orders/:orderId
```

### Description

Returns an order by ID.

This endpoint should also return the current simulated order status.

### Response: 200

```json
{
  "order": {
    "id": "order_123",
    "items": [
      {
        "menuItemId": "pizza-margherita",
        "name": "Margherita Pizza",
        "price": 299,
        "quantity": 2
      }
    ],
    "customer": {
      "name": "Raghav",
      "address": "123 Main Street",
      "phone": "9876543210"
    },
    "status": "Preparing",
    "total": 598,
    "createdAt": "2026-06-03T10:00:00.000Z",
    "updatedAt": "2026-06-03T10:00:10.000Z"
  }
}
```

### Error: 404

```json
{
  "error": "Order not found"
}
```

---

## 4. Update Order Status

```txt
PATCH /api/orders/:orderId/status
```

### Description

Updates an order status manually.

This endpoint is useful for testing CRUD/status update behavior required by the assessment.

### Request Body

```json
{
  "status": "Out for Delivery"
}
```

### Validation Rules

`status` must be one of:

```txt
Order Received
Preparing
Out for Delivery
Delivered
```

### Response: 200

```json
{
  "order": {
    "id": "order_123",
    "items": [
      {
        "menuItemId": "pizza-margherita",
        "name": "Margherita Pizza",
        "price": 299,
        "quantity": 2
      }
    ],
    "customer": {
      "name": "Raghav",
      "address": "123 Main Street",
      "phone": "9876543210"
    },
    "status": "Out for Delivery",
    "total": 598,
    "createdAt": "2026-06-03T10:00:00.000Z",
    "updatedAt": "2026-06-03T10:00:20.000Z"
  }
}
```

### Error: 400

```json
{
  "error": "Invalid status"
}
```

### Error: 404

```json
{
  "error": "Order not found"
}
```

---

# Zod Validation Plan

Recommended file:

```txt
src/lib/validation.ts
```

Recommended schemas:

```ts
import { z } from "zod";

export const orderStatusSchema = z.enum([
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
]);

export const createOrderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const customerDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, "Cart cannot be empty"),
  customer: customerDetailsSchema,
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
```

---

# Error Response Format

Use a consistent error format.

Simple error:

```json
{
  "error": "Order not found"
}
```

Validation error:

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "field": "customer.name",
      "message": "Name is required"
    }
  ]
}
```

---

# Testing Requirements

## API Tests

Required endpoint tests:

```txt
GET /api/menu
POST /api/orders
GET /api/orders/:orderId
PATCH /api/orders/:orderId/status
```

Required cases:

- Menu returns items
- Order can be created
- Order cannot be created with empty cart
- Order cannot be created with missing customer details
- Order cannot be created with invalid menu item ID
- Existing order can be fetched
- Missing order returns 404
- Order status can be updated
- Invalid order status returns 400

---

## UI Tests

Required component tests:

- Menu item renders correctly
- Add to cart works
- Quantity increases
- Quantity decreases
- Cart total updates
- Checkout form renders
- Checkout form shows validation errors
- Order status tracker shows current status

---

# Frontend Polling Contract

The order status page should poll:

```txt
GET /api/orders/:orderId
```

Recommended interval:

```txt
2000ms or 3000ms
```

Stop polling when status is:

```txt
Delivered
```

This avoids unnecessary requests after the order reaches its final status.
