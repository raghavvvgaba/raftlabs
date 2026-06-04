import type { MenuItem } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: MenuItem;
  quantity: number;
}

export function CartItem({ item, quantity }: CartItemProps) {
  const { incrementItem, decrementItem, removeItem } = useCart();

  return (
    <div className="flex flex-col border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-12 sm:w-12">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
          <p className="text-sm text-muted-foreground">₹{item.price} each</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive sm:hidden"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => decrementItem(item.id)}
            className="h-10 w-10 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <span className="inline-flex h-10 w-10 items-center justify-center text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => incrementItem(item.id)}
            className="h-10 w-10 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
            aria-label="Increase quantity"
          >
            +
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            ₹{(item.price * quantity).toFixed(2)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="hidden h-9 px-2 text-muted-foreground hover:text-destructive sm:inline-flex"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-1">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
