"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import type { Order, OrderStatus, RecentOrderRef } from "@/lib/types";
import { getRecentOrders } from "@/lib/recent-orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentOrdersDropdownProps {
  defaultOpen?: boolean;
}

type RecentOrderStatus = OrderStatus | "Unavailable";
type StatusByOrderId = Record<string, RecentOrderStatus>;

const statusBadgeClasses: Record<RecentOrderStatus, string> = {
  "Order Received": "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Preparing:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Out for Delivery":
    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Delivered:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Unavailable:
    "bg-muted text-muted-foreground",
};

export function RecentOrdersDropdown({ defaultOpen = false }: RecentOrdersDropdownProps) {
  const [orders, setOrders] = useState<RecentOrderRef[]>([]);
  const [statuses, setStatuses] = useState<StatusByOrderId>({});

  useEffect(() => {
    const recentOrders = getRecentOrders();
    setOrders(recentOrders);

    if (recentOrders.length === 0) {
      setStatuses({});
      return;
    }

    let isActive = true;

    async function fetchStatuses() {
      const entries = await Promise.all(
        recentOrders.map(async (order) => {
          try {
            const response = await fetch(`/api/orders/${order.orderId}`);
            if (!response.ok) {
              return [order.orderId, "Unavailable"] as const;
            }

            const data = (await response.json()) as { order?: Order };
            return [
              order.orderId,
              data.order?.status ?? "Unavailable",
            ] as const;
          } catch {
            return [order.orderId, "Unavailable"] as const;
          }
        })
      );

      if (isActive) {
        setStatuses(Object.fromEntries(entries));
      }
    }

    fetchStatuses();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-xl border-border/70 bg-background/70 px-3 shadow-sm"
        >
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline">Orders</span>
          {orders.length > 0 && (
            <Badge variant="secondary" className="ml-0.5 h-5 px-1.5">
              {orders.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-2">
        <DropdownMenuLabel className="flex items-center justify-between gap-3">
          <span>Order history</span>
          <span className="text-xs font-normal text-muted-foreground">
            {orders.length} recent
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {orders.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No recent orders yet.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {orders.map((order, index) => (
              <DropdownMenuItem key={order.orderId} asChild className="p-0">
                <Link
                  href={`/orders/${order.orderId}`}
                  className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      Order {index + 1}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${
                          statusBadgeClasses[
                            statuses[order.orderId] ?? "Unavailable"
                          ]
                        }`}
                      >
                        {statuses[order.orderId] ?? "Checking status"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.savedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-sm font-semibold text-secondary-foreground">
                    ₹{order.total.toFixed(2)}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
