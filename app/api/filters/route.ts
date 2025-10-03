import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, fonts, colors, layoutTypes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'website', 'section', 'dashboard', or 'flow'

    let categoriesData;

    if (type && ["website", "section", "dashboard", "flow"].includes(type)) {
      // Filter categories by type
      categoriesData = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(
          eq(
            categories.type,
            type as "website" | "section" | "dashboard" | "flow"
          )
        );
    } else {
      // Return all categories if no type specified
      categoriesData = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories);
    }

    const [fontsData, colorsData, layoutTypesData] = await Promise.all([
      db.select({ id: fonts.id, name: fonts.name }).from(fonts),
      db.select({ id: colors.id, name: colors.name }).from(colors),
      db
        .select({ id: layoutTypes.id, name: layoutTypes.name })
        .from(layoutTypes),
    ]);

    return NextResponse.json({
      categories: categoriesData,
      fonts: fontsData,
      colors: colorsData,
      layoutTypes: layoutTypesData,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
