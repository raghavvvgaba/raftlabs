import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/store";
import { getSimulatedOrderStatus } from "@/lib/status";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const simulatedStatus = getSimulatedOrderStatus(order.createdAt);
    const responseOrder = { ...order, status: simulatedStatus };

    return NextResponse.json({ order: responseOrder });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
