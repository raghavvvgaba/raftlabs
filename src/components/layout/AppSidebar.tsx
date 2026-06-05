"use client";

import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cart } from "@/components/cart/Cart";
import { useTheme } from "@/lib/theme-context";
import { RecentOrdersDropdown } from "@/components/order-status/RecentOrdersDropdown";

export function AppSidebar() {
  const { theme, isMounted, toggleTheme } = useTheme();
  const isDarkMode = isMounted && theme === "dark";

  return (
    <div className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            RaftLabs
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <RecentOrdersDropdown />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-xl border-border/70 bg-background/70 shadow-sm"
          >
            {isDarkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
          </Button>
          <Cart className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
