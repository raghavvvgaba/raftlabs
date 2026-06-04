"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { getMenuItems } from "@/lib/store";
import { createOrderSchema, formatValidationIssues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function CheckoutForm() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuItems = getMenuItems();
  const cartTotal = items.reduce((sum, cartItem) => {
    const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
    return sum + (menuItem?.price ?? 0) * cartItem.quantity;
  }, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const orderPayload = {
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
      customer: { name, address, phone },
    };

    const parseResult = createOrderSchema.safeParse(orderPayload);
    if (!parseResult.success) {
      setError(
        formatValidationIssues(parseResult.error.issues)
          .map((issue) => issue.message)
          .join(" ")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parseResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        const details =
          Array.isArray(data.details) && data.details.length > 0
            ? data.details
                .map((detail: { message?: string }) => detail.message)
                .filter(Boolean)
                .join(" ")
            : "";
        setError(
          details || data.message || data.error || "Failed to place order. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/orders/${data.order.id}`);
    } catch {
      setError("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/">
          <Button variant="outline">Back to Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div
          role="alert"
          className="bg-destructive/10 text-destructive px-4 py-3 rounded-md border border-destructive/20"
        >
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((cartItem) => {
            const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
            if (!menuItem) return null;
            return (
              <div
                key={cartItem.menuItemId}
                className="flex justify-between text-sm"
              >
                <span>
                  {menuItem.name} x {cartItem.quantity}
                </span>
                <Badge variant="secondary">
                  ₹{(menuItem.price * cartItem.quantity).toFixed(2)}
                </Badge>
              </div>
            );
          })}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          placeholder="Enter your delivery address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="Enter your phone number"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/" className="flex-1">
          <Button variant="secondary" className="w-full">
            Back to Menu
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
