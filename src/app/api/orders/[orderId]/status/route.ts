import { NextResponse } from "next/server";
import { updateOrderStatusSchema } from "@/lib/validation";
import { getOrderById, updateOrderStatus } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const parseResult = updateOrderStatusSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = updateOrderStatus(orderId, parseResult.data.status);
    return NextResponse.json({ order: updatedOrder });
  } catch {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
