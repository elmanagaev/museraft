import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  websites,
  websiteCategories,
  websiteFonts,
  websiteColors,
  categories,
  fonts,
  colors,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const font = searchParams.get("font");
    const color = searchParams.get("color");

    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Build the query
    let query = db
      .select({
        id: websites.id,
        title: websites.title,
        description: websites.description,
        screenshotUrl: websites.screenshotUrl,
        websiteUrl: websites.websiteUrl,
        createdAt: websites.createdAt,
      })
      .from(websites);

    // Apply filters if provided
    if (category) {
      query = query
        .innerJoin(
          websiteCategories,
          eq(websites.id, websiteCategories.websiteId)
        )
        .innerJoin(categories, eq(websiteCategories.categoryId, categories.id))
        .where(eq(categories.name, category)) as any;
    }

    if (font) {
      query = query
        .innerJoin(websiteFonts, eq(websites.id, websiteFonts.websiteId))
        .innerJoin(fonts, eq(websiteFonts.fontId, fonts.id))
        .where(eq(fonts.name, font)) as any;
    }

    if (color) {
      query = query
        .innerJoin(websiteColors, eq(websites.id, websiteColors.websiteId))
        .innerJoin(colors, eq(websiteColors.colorId, colors.id))
        .where(eq(colors.name, color)) as any;
    }

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(websites);

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
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { error: "Failed to fetch websites" },
      { status: 500 }
    );
  }
}
