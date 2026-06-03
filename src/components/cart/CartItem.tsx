import type { MenuItem } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: MenuItem;
  quantity: number;
}

export function CartItem({ item, quantity }: CartItemProps) {
  const { incrementItem, decrementItem, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => decrementItem(item.id)}
          aria-label="Decrease quantity"
        >
          -
        </Button>
        <Badge variant="secondary" className="w-8 justify-center">
          {quantity}
        </Badge>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => incrementItem(item.id)}
          aria-label="Increase quantity"
        >
          +
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          className="text-destructive hover:text-destructive"
          aria-label="Remove item"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
