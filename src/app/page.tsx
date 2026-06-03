"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/types";
import { MenuList } from "@/components/menu/MenuList";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "list";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load menu");
          setIsLoading(false);
          return;
        }

        setMenuItems(data.items);
        setIsLoading(false);
      } catch {
        setError("Failed to load menu. Please try again.");
        setIsLoading(false);
      }
    }

    fetchMenu();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <AppSidebar />

      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-4xl font-bold text-foreground">
            Food Delivery
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse our delicious menu and order your favorite food for delivery.
          </p>
        </div>

        {!isLoading && !error && (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="mt-4 text-muted-foreground">Loading menu...</p>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-destructive">
            {error}
          </div>
        )}

        {!isLoading && !error && <MenuList items={menuItems} view={viewMode} />}
      </div>
    </main>
  );
}
