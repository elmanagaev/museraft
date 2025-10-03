import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sections, sectionCategories, categories } from "@/lib/db/schema";
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
        id: sections.id,
        title: sections.title,
        description: sections.description,
        screenshotUrl: sections.screenshotUrl,
        createdAt: sections.createdAt,
      })
      .from(sections);

    // Apply category filter if provided
    if (category) {
      query = query
        .innerJoin(
          sectionCategories,
          eq(sections.id, sectionCategories.sectionId)
        )
        .innerJoin(categories, eq(sectionCategories.categoryId, categories.id))
        .where(eq(categories.name, category)) as any;
    }

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(sections);

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
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}
