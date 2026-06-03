import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/store";

export function GET() {
  try {
    const items = getMenuItems();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
