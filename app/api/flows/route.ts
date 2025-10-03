import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { flows, flowCategories, categories } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");

    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Build the query
    let query = db
      .select({
        id: flows.id,
        title: flows.title,
        description: flows.description,
        screenshotUrls: flows.screenshotUrls,
        createdAt: flows.createdAt,
      })
      .from(flows);

    // Apply category filter if provided
    if (category) {
      query = query
        .innerJoin(flowCategories, eq(flows.id, flowCategories.flowId))
        .innerJoin(categories, eq(flowCategories.categoryId, categories.id))
        .where(eq(categories.name, category)) as any;
    }

    // Get total count
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(flows);

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
    console.error("Error fetching flows:", error);
    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: 500 }
    );
  }
}
