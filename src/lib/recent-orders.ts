import type { RecentOrderRef } from "./types";

export const RECENT_ORDERS_STORAGE_KEY = "food-delivery.recent-orders";
export const MAX_RECENT_ORDERS = 5;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getRecentOrders(): RecentOrderRef[] {
  if (!isBrowser()) {
    return [];
  }

  const stored = window.localStorage.getItem(RECENT_ORDERS_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is RecentOrderRef =>
        typeof item === "object" &&
        item !== null &&
        typeof item.orderId === "string" &&
        typeof item.total === "number" &&
        typeof item.savedAt === "string"
    );
  } catch {
    return [];
  }
}

export function saveRecentOrder(orderId: string, total: number): RecentOrderRef[] {
  if (!isBrowser()) {
    return [];
  }

  const nextOrder: RecentOrderRef = {
    orderId,
    total,
    savedAt: new Date().toISOString(),
  };

  const deduped = getRecentOrders().filter((order) => order.orderId !== orderId);
  const nextOrders = [nextOrder, ...deduped].slice(0, MAX_RECENT_ORDERS);

  window.localStorage.setItem(
    RECENT_ORDERS_STORAGE_KEY,
    JSON.stringify(nextOrders)
  );

  return nextOrders;
}
