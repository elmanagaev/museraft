import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  dashboards,
  dashboardCategories,
  dashboardLayoutTypes,
  dashboardColors,
  categories,
  layoutTypes,
  colors,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const layoutType = searchParams.get("layout");
    const color = searchParams.get("color");

    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Build the query
    let query = db
      .select({
        id: dashboards.id,
        title: dashboards.title,
        description: dashboards.description,
        screenshotUrl: dashboards.screenshotUrl,
        createdAt: dashboards.createdAt,
      })
      .from(dashboards);

    // Apply filters if provided
    if (category) {
      query = query
        .innerJoin(
          dashboardCategories,
          eq(dashboards.id, dashboardCategories.dashboardId)
        )
        .innerJoin(
          categories,
          eq(dashboardCategories.categoryId, categories.id)
        )
        .where(eq(categories.name, category)) as any;
    }

    if (layoutType) {
      query = query
        .innerJoin(
          dashboardLayoutTypes,
          eq(dashboards.id, dashboardLayoutTypes.dashboardId)
        )
        .innerJoin(
          layoutTypes,
          eq(dashboardLayoutTypes.layoutTypeId, layoutTypes.id)
        )
        .where(eq(layoutTypes.name, layoutType)) as any;
    }

    if (color) {
      query = query
        .innerJoin(
          dashboardColors,
          eq(dashboards.id, dashboardColors.dashboardId)
        )
        .innerJoin(colors, eq(dashboardColors.colorId, colors.id))
        .where(eq(colors.name, color)) as any;
    }

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(dashboards);

    const [{ count }] = await countQuery;
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    // Get paginated results
    const results = await query.limit(ITEMS_PER_PAGE).offset(offset);

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        totalPages,
        totalItems: count,
        itemsPerPage: ITEMS_PER_PAGE,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboards" },
      { status: 500 }
    );
  }
}
