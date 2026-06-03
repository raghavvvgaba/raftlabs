import type { MenuItem } from "@/lib/types";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemList } from "./MenuItemList";

type ViewMode = "grid" | "list";

interface MenuListProps {
  items: MenuItem[];
  view: ViewMode;
}

export function MenuList({ items, view }: MenuListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No menu items available.
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="mx-auto max-w-4xl">
        {items.map((item) => (
          <MenuItemList key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
