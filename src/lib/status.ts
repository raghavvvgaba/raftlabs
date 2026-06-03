import type { OrderStatus } from "./types";

export function getSimulatedOrderStatus(createdAt: string): OrderStatus {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const seconds = Math.floor(elapsed / 1000);

  if (seconds < 10) return "Order Received";
  if (seconds < 20) return "Preparing";
  if (seconds < 30) return "Out for Delivery";
  return "Delivered";
}
