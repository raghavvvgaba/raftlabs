import { describe, expect, it, vi } from "vitest";
import { getSimulatedOrderStatus } from "./status";

describe("getSimulatedOrderStatus", () => {
  it("returns each status based on elapsed time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T10:00:00.000Z"));

    expect(getSimulatedOrderStatus("2026-06-03T09:59:55.000Z")).toBe(
      "Order Received"
    );
    expect(getSimulatedOrderStatus("2026-06-03T09:59:45.000Z")).toBe(
      "Preparing"
    );
    expect(getSimulatedOrderStatus("2026-06-03T09:59:35.000Z")).toBe(
      "Out for Delivery"
    );
    expect(getSimulatedOrderStatus("2026-06-03T09:59:25.000Z")).toBe(
      "Delivered"
    );

    vi.useRealTimers();
  });
});
