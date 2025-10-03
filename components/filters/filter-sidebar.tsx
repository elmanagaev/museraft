"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  categories?: FilterOption[];
  fonts?: FilterOption[];
  colors?: FilterOption[];
  layoutTypes?: FilterOption[];
  type: "website" | "section" | "dashboard" | "flow";
}

export function FilterSidebar({
  categories,
  fonts,
  colors,
  layoutTypes,
  type,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.get("category")?.split(",") || [];
  const selectedFonts = searchParams.get("font")?.split(",") || [];
  const selectedColors = searchParams.get("color")?.split(",") || [];
  const selectedLayouts = searchParams.get("layout")?.split(",") || [];

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedFonts.length > 0 ||
    selectedColors.length > 0 ||
    selectedLayouts.length > 0;

  const updateFilter = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    const params = new URLSearchParams(searchParams);
    const currentValues =
      params.get(filterType)?.split(",").filter(Boolean) || [];

    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    if (newValues.length > 0) {
      params.set(filterType, newValues.join(","));
    } else {
      params.delete(filterType);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  return (
    <aside className="w-full lg:w-64 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {categories && categories.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) =>
                    updateFilter("category", category.name, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {fonts && fonts.length > 0 && type === "website" && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Fonts</h3>
          <div className="space-y-2">
            {fonts.map((font) => (
              <div key={font.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`font-${font.id}`}
                  checked={selectedFonts.includes(font.name)}
                  onCheckedChange={(checked) =>
                    updateFilter("font", font.name, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`font-${font.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {font.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {colors &&
        colors.length > 0 &&
        (type === "website" || type === "dashboard") && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Colors</h3>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color.id}`}
                    checked={selectedColors.includes(color.name)}
                    onCheckedChange={(checked) =>
                      updateFilter("color", color.name, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`color-${color.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {color.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

      {layoutTypes && layoutTypes.length > 0 && type === "dashboard" && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Layout Types</h3>
          <div className="space-y-2">
            {layoutTypes.map((layout) => (
              <div key={layout.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`layout-${layout.id}`}
                  checked={selectedLayouts.includes(layout.name)}
                  onCheckedChange={(checked) =>
                    updateFilter("layout", layout.name, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`layout-${layout.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {layout.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
