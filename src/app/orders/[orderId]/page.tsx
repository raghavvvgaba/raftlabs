"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { OrderStatusTracker } from "@/components/order-status/OrderStatusTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ORDER_POLLING_INTERVAL_MS = 3000;

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Order not found");
          setIsLoading(false);
          return;
        }

        setOrder(data.order);
        setError("");
        setIsLoading(false);
      } catch {
        setError("Failed to fetch order status");
        setIsLoading(false);
      }
    }

    fetchOrder();

    if (order?.status === "Delivered") {
      return;
    }

    const interval = setInterval(() => {
      fetchOrder();
    }, ORDER_POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md border border-destructive/20 mb-4">
            {error}
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            The order may have expired from the in-memory store or the request
            may have failed. You can return to the menu and place a fresh order.
          </p>
          <Link href="/">
            <Button variant="outline">Back to Menu</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order #{order.id.slice(-6)}
        </h1>
        <p className="text-muted-foreground mb-8">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="space-y-6">
          <OrderStatusTracker order={order} />

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {order.customer.name}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.customer.address}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.customer.phone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button variant="outline">Place Another Order</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
