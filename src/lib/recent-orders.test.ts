import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getRecentOrders,
  MAX_RECENT_ORDERS,
  RECENT_ORDERS_STORAGE_KEY,
  saveRecentOrder,
} from "./recent-orders";

describe("recent order persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-05T10:00:00.000Z"));
  });

  it("returns an empty list when storage is empty", () => {
    expect(getRecentOrders()).toEqual([]);
  });

  it("adds a new recent order", () => {
    const recentOrders = saveRecentOrder("order_1", 299);

    expect(recentOrders).toEqual([
      {
        orderId: "order_1",
        total: 299,
        savedAt: "2026-06-05T10:00:00.000Z",
      },
    ]);
  });

  it("deduplicates repeated order ids and keeps the newest first", () => {
    saveRecentOrder("order_1", 299);
    vi.setSystemTime(new Date("2026-06-05T10:01:00.000Z"));
    saveRecentOrder("order_2", 199);
    vi.setSystemTime(new Date("2026-06-05T10:02:00.000Z"));

    const recentOrders = saveRecentOrder("order_1", 598);

    expect(recentOrders).toEqual([
      {
        orderId: "order_1",
        total: 598,
        savedAt: "2026-06-05T10:02:00.000Z",
      },
      {
        orderId: "order_2",
        total: 199,
        savedAt: "2026-06-05T10:01:00.000Z",
      },
    ]);
  });

  it("caps the list at the maximum recent order count", () => {
    for (let index = 1; index <= MAX_RECENT_ORDERS + 1; index += 1) {
      vi.setSystemTime(new Date(`2026-06-05T10:0${index}:00.000Z`));
      saveRecentOrder(`order_${index}`, index * 100);
    }

    const recentOrders = getRecentOrders();

    expect(recentOrders).toHaveLength(MAX_RECENT_ORDERS);
    expect(recentOrders[0].orderId).toBe("order_6");
    expect(recentOrders.at(-1)?.orderId).toBe("order_2");
  });

  it("returns an empty list for invalid stored data", () => {
    localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, "{not-json");

    expect(getRecentOrders()).toEqual([]);
  });
});
