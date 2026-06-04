import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Cart } from "./cart/Cart";
import { CheckoutForm } from "./checkout/CheckoutForm";
import { MenuItemCard } from "./menu/MenuItemCard";
import { OrderStatusTracker } from "./order-status/OrderStatusTracker";
import { CartProvider, useCart } from "@/lib/cart-context";
import type { MenuItem, Order } from "@/lib/types";

const pizza: MenuItem = {
  id: "pizza-margherita",
  name: "Margherita Pizza",
  description: "Classic cheese pizza with tomato sauce and fresh basil.",
  price: 299,
  image: "https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg",
  foodType: "veg",
};

function renderWithCart(ui: React.ReactNode) {
  return render(<CartProvider>{ui}</CartProvider>);
}

function SeedCartButton() {
  const { addItem } = useCart();
  return <button onClick={() => addItem("pizza-margherita")}>Seed cart</button>;
}

describe("order flow components", () => {
  it("renders a menu item card with name, description, price, and image", () => {
    renderWithCart(<MenuItemCard item={pizza} />);

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(
      screen.getByText("Classic cheese pizza with tomato sauce and fresh basil.")
    ).toBeInTheDocument();
    expect(screen.getByText("₹299")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Margherita Pizza" })).toBeInTheDocument();
  });

  it("adds an item and updates quantity controls", () => {
    renderWithCart(<MenuItemCard item={pizza} />);

    fireEvent.click(screen.getByRole("button", { name: "ADD" }));
    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("updates the cart total when items are added", async () => {
    renderWithCart(
      <>
        <MenuItemCard item={pizza} />
        <Cart />
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "ADD" }));
    fireEvent.click(screen.getByRole("button", { name: "Open cart" }));

    expect(await screen.findByText("Total:")).toBeInTheDocument();
    const totals = screen.getAllByText("₹299.00");
    expect(totals.length).toBe(2); // cart item sub-total + cart total
  });

  it("renders checkout form required fields", () => {
    renderWithCart(
      <>
        <SeedCartButton />
        <CheckoutForm />
      </>
    );

    fireEvent.click(screen.getByText("Seed cart"));

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
  });

  it("renders checkout fields and shows validation messages", async () => {
    renderWithCart(
      <>
        <SeedCartButton />
        <CheckoutForm />
      </>
    );

    fireEvent.click(screen.getByText("Seed cart"));
    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Name is required");
    expect(screen.getByRole("alert")).toHaveTextContent("Address is required");
    expect(screen.getByRole("alert")).toHaveTextContent("Phone number is required");
  });

  it("shows API validation details during checkout failures", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: [{ message: "Phone number must be 10 digits" }],
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    renderWithCart(
      <>
        <SeedCartButton />
        <CheckoutForm />
      </>
    );

    fireEvent.click(screen.getByText("Seed cart"));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Raghav" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "123 Main Street" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "9876543210" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Phone number must be 10 digits"
    );

    vi.restoreAllMocks();
  });

  it("displays the current order status", () => {
    const order: Order = {
      id: "order_123",
      items: [
        {
          menuItemId: "pizza-margherita",
          name: "Margherita Pizza",
          price: 299,
          quantity: 1,
        },
      ],
      customer: {
        name: "Raghav",
        address: "123 Main Street",
        phone: "9876543210",
      },
      status: "Preparing",
      total: 299,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(<OrderStatusTracker order={order} />);

    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(screen.getByText("Current status")).toBeInTheDocument();
  });
});
