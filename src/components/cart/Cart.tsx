"use client";

import { useCart } from "@/lib/cart-context";
import { getMenuItems } from "@/lib/store";
import { CartItem } from "./CartItem";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartProps {
  className?: string;
}

export function Cart({ className }: CartProps) {
  const { items, totalItems, clearCart } = useCart();
  const menuItems = getMenuItems();

  const cartTotal = items.reduce((sum, cartItem) => {
    const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
    return sum + (menuItem?.price ?? 0) * cartItem.quantity;
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative h-10 w-10 border-border/70 bg-background/70 shadow-sm",
            className
          )}
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Your cart is empty.
            </div>
          ) : (
            items.map((cartItem) => {
              const menuItem = menuItems.find(
                (m) => m.id === cartItem.menuItemId
              );
              if (!menuItem) return null;
              return (
                <CartItem
                  key={cartItem.menuItemId}
                  item={menuItem}
                  quantity={cartItem.quantity}
                />
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={clearCart}
                className="flex-1"
              >
                Clear Cart
              </Button>
              <SheetClose asChild>
                <Link href="/checkout" className="flex-1">
                  <Button className="w-full">Checkout</Button>
                </Link>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
