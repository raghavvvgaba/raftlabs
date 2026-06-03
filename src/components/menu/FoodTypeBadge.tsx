import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type FoodTypeBadgeProps = {
  foodType: MenuItem["foodType"];
  className?: string;
};

export function FoodTypeBadge({
  foodType,
  className,
}: FoodTypeBadgeProps) {
  const isVeg = foodType === "veg";

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-7 w-7 rounded-md p-0",
        isVeg
          ? "border-emerald-600/45 bg-emerald-500/10"
          : "border-rose-600/45 bg-rose-500/10",
        className
      )}
      aria-label={isVeg ? "Vegetarian item" : "Non-vegetarian item"}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-[3px] border",
          isVeg
            ? "border-emerald-600/60"
            : "border-rose-600/60"
        )}
        aria-hidden="true"
        >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isVeg ? "bg-emerald-600" : "bg-rose-600"
          )}
        />
      </span>
    </Badge>
  );
}
