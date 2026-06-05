"use client";

import type { Order, OrderStatus } from "@/lib/types";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderStatusTrackerProps {
  order: Order;
}

const statusSteps: OrderStatus[] = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const statusColors: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  "Order Received": "secondary",
  "Preparing": "default",
  "Out for Delivery": "default",
  "Delivered": "outline",
};

export function OrderStatusTracker({ order }: OrderStatusTrackerProps) {
  const currentIndex = statusSteps.indexOf(order.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {statusSteps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isLast = index === statusSteps.length - 1;

            return (
              <div key={step} className="grid grid-cols-[2rem_1fr] gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 dark:bg-emerald-500 dark:text-emerald-950"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  {!isLast && (
                    <div
                      className={`h-10 w-0.5 transition-colors ${
                        index < currentIndex
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <div className={`${isLast ? "pb-0" : "pb-6"} pt-1`}>
                  <p
                    className={`font-semibold ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </p>
                  {isCurrent && (
                    <Badge variant={statusColors[step]} className="mt-1">
                      Current status
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
