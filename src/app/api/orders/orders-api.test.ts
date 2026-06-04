import { describe, expect, it } from "vitest";
import { GET as getMenu } from "../menu/route";
import { POST as createOrder } from "./route";
import { GET as getOrder } from "./[orderId]/route";
import { PATCH as updateOrderStatus } from "./[orderId]/status/route";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function createValidOrder() {
  const response = await createOrder(
    jsonRequest({
      items: [{ menuItemId: "pizza-margherita", quantity: 2 }],
      customer: {
        name: "Raghav",
        address: "123 Main Street",
        phone: "9876543210",
      },
    })
  );
  const data = await response.json();

  return { response, order: data.order };
}

describe("order API routes", () => {
  it("returns menu items", async () => {
    const response = await getMenu();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
      })
    );
  });

  it("creates an order", async () => {
    const { response, order } = await createValidOrder();

    expect(response.status).toBe(201);
    expect(order).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: "Order Received",
        total: 598,
      })
    );
    expect(order.items[0]).toEqual(
      expect.objectContaining({
        menuItemId: "pizza-margherita",
        name: "Margherita Pizza",
        quantity: 2,
      })
    );
  });

  it("rejects an empty cart", async () => {
    const response = await createOrder(
      jsonRequest({
        items: [],
        customer: {
          name: "Raghav",
          address: "123 Main Street",
          phone: "9876543210",
        },
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request body");
    expect(data.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Cart cannot be empty" }),
      ])
    );
  });

  it("rejects missing customer details", async () => {
    const response = await createOrder(
      jsonRequest({
        items: [{ menuItemId: "pizza-margherita", quantity: 1 }],
        customer: {
          name: "",
          address: "",
          phone: "",
        },
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Name is required" }),
        expect.objectContaining({ message: "Address is required" }),
        expect.objectContaining({ message: "Phone number is required" }),
      ])
    );
  });

  it("rejects invalid phone numbers", async () => {
    const response = await createOrder(
      jsonRequest({
        items: [{ menuItemId: "pizza-margherita", quantity: 1 }],
        customer: {
          name: "Raghav",
          address: "123 Main Street",
          phone: "12345",
        },
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Phone number must be 10 digits",
        }),
      ])
    );
  });

  it("rejects invalid menu item IDs", async () => {
    const response = await createOrder(
      jsonRequest({
        items: [{ menuItemId: "not-real", quantity: 1 }],
        customer: {
          name: "Raghav",
          address: "123 Main Street",
          phone: "9876543210",
        },
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid menu item");
  });

  it("fetches an order by ID", async () => {
    const { order } = await createValidOrder();
    const response = await getOrder(new Request("http://localhost"), {
      params: Promise.resolve({ orderId: order.id }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.order.id).toBe(order.id);
  });

  it("returns 404 for missing orders", async () => {
    const response = await getOrder(new Request("http://localhost"), {
      params: Promise.resolve({ orderId: "missing-order" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Order not found");
  });

  it("updates order status", async () => {
    const { order } = await createValidOrder();
    const response = await updateOrderStatus(
      new Request("http://localhost/api/orders/id/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Out for Delivery" }),
      }),
      { params: Promise.resolve({ orderId: order.id }) }
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.order.status).toBe("Out for Delivery");
  });

  it("rejects invalid status updates", async () => {
    const { order } = await createValidOrder();
    const response = await updateOrderStatus(
      new Request("http://localhost/api/orders/id/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cooking" }),
      }),
      { params: Promise.resolve({ orderId: order.id }) }
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid status");
  });
});
