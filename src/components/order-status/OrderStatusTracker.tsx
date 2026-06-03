"use client";

import type { Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        <div className="relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted" />
          <div
            className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
            style={{
              height: `${Math.max(0, (currentIndex / (statusSteps.length - 1)) * 100)}%`,
            }}
          />

          <div className="space-y-8 relative">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
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
        </div>
      </CardContent>
    </Card>
  );
}
