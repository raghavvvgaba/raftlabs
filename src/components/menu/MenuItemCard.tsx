"use client";

import type { MenuItem } from "@/lib/types";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodTypeBadge } from "./FoodTypeBadge";
import { Minus, Plus } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, incrementItem, decrementItem, items } = useCart();
  const cartItem = items.find((i) => i.menuItemId === item.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <Card className="group overflow-hidden rounded-lg border border-border bg-card py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:shadow-none">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <FoodTypeBadge foodType={item.foodType} />
          <Badge variant="secondary" className="h-7 rounded-md bg-background/90 px-2.5 font-semibold text-foreground shadow-sm backdrop-blur dark:bg-background/80">
            ₹{item.price}
          </Badge>
        </div>
      </div>
      <CardHeader className="px-4 pb-1 pt-4">
        <h3 className="text-base font-semibold leading-6 text-foreground">
          {item.name}
        </h3>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="mb-4 min-h-11 text-sm leading-5 text-muted-foreground">
          {item.description}
        </p>
        {quantity > 0 ? (
          <div className="grid h-10 w-full grid-cols-3 items-center overflow-hidden rounded-md border border-border bg-background shadow-sm dark:bg-secondary/70 dark:shadow-none">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => decrementItem(item.id)}
              className="h-10 w-full rounded-none text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="border-x border-border text-center text-base font-semibold text-emerald-600 dark:text-emerald-400">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => incrementItem(item.id)}
              className="h-10 w-full rounded-none text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => addItem(item.id)}
            className="h-10 w-full rounded-md font-semibold"
          >
            ADD
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
