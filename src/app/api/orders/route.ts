import { NextResponse } from "next/server";
import { createOrderSchema, formatValidationIssues } from "@/lib/validation";
import { getMenuItemById, createOrder } from "@/lib/store";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body", details: [] },
        { status: 400 }
      );
    }

    const parseResult = createOrderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: formatValidationIssues(parseResult.error.issues),
        },
        { status: 400 }
      );
    }

    const { items, customer } = parseResult.data;

    const invalidItem = items.find((item) => !getMenuItemById(item.menuItemId));
    if (invalidItem) {
      return NextResponse.json(
        {
          error: "Invalid menu item",
          message: "One or more menu items do not exist",
        },
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
