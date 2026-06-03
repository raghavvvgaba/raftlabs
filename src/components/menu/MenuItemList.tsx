"use client";

import type { MenuItem } from "@/lib/types";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FoodTypeBadge } from "./FoodTypeBadge";
import { Minus, Plus } from "lucide-react";

interface MenuItemListProps {
  item: MenuItem;
}

export function MenuItemList({ item }: MenuItemListProps) {
  const { addItem, incrementItem, decrementItem, items } = useCart();
  const cartItem = items.find((i) => i.menuItemId === item.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="py-3">
      <Card className="overflow-visible rounded-lg border border-border bg-card py-0 shadow-sm transition-all duration-200 hover:shadow-md dark:shadow-none">
        <CardContent className="flex gap-4 p-3 sm:gap-5 sm:p-4">
          <div className="min-w-0 flex-1 py-1">
            <div className="mb-2 flex items-center gap-2">
              <FoodTypeBadge foodType={item.foodType} />
              <Badge variant="secondary" className="h-6 rounded-md px-2 font-semibold">
                ₹{item.price}
              </Badge>
            </div>
            <h3 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
              {item.name}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground sm:line-clamp-2">
              {item.description}
            </p>
          </div>

          <div className="relative flex aspect-square w-32 shrink-0 items-end justify-center sm:w-40">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="rounded-lg object-cover"
              sizes="160px"
            />
            {quantity > 0 ? (
              <div className="absolute -bottom-3 left-1/2 grid h-10 w-[84%] -translate-x-1/2 grid-cols-3 items-center overflow-hidden rounded-md border border-border bg-background shadow-md dark:bg-secondary/90 dark:shadow-none">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => decrementItem(item.id)}
                  className="h-10 w-full rounded-none text-primary hover:bg-secondary hover:text-foreground dark:hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="border-x border-border text-center text-base font-semibold text-primary">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => incrementItem(item.id)}
                  className="h-10 w-full rounded-none text-primary hover:bg-secondary hover:text-foreground dark:hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => addItem(item.id)}
                className="absolute -bottom-3 left-1/2 h-10 w-[84%] -translate-x-1/2 rounded-md border-border bg-background font-semibold text-foreground shadow-md hover:bg-secondary hover:text-foreground dark:bg-secondary/90 dark:text-foreground dark:shadow-none dark:hover:bg-muted"
                variant="outline"
              >
                ADD
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Separator className="mt-6" />
    </div>
  );
}
