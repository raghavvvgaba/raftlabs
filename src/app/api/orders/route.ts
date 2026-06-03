import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validation";
import { getMenuItemById, createOrder } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = createOrderSchema.safeParse(body);

    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: "Invalid request body", details },
        { status: 400 }
      );
    }

    const { items, customer } = parseResult.data;

    const invalidItem = items.find((item) => !getMenuItemById(item.menuItemId));
    if (invalidItem) {
      return NextResponse.json(
        { error: "Invalid menu item", message: "One or more menu items do not exist" },
        { status: 400 }
      );
    }

    const orderItems = items.map((item) => {
      const menuItem = getMenuItemById(item.menuItemId)!;
      return {
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    const order = createOrder(orderItems, customer);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
