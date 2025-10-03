import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/utils";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [website] = await db
      .select()
      .from(websites)
      .where(eq(websites.id, id))
      .limit(1);

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Get categories
    const websiteCategs = await db
      .select({ id: categories.id, name: categories.name })
      .from(websiteCategories)
      .innerJoin(categories, eq(websiteCategories.categoryId, categories.id))
      .where(eq(websiteCategories.websiteId, id));

    // Get fonts
    const websiteFontsList = await db
      .select({ id: fonts.id, name: fonts.name })
      .from(websiteFonts)
      .innerJoin(fonts, eq(websiteFonts.fontId, fonts.id))
      .where(eq(websiteFonts.websiteId, id));

    // Get colors
    const websiteColorsList = await db
      .select({ id: colors.id, name: colors.name })
      .from(websiteColors)
      .innerJoin(colors, eq(websiteColors.colorId, colors.id))
      .where(eq(websiteColors.websiteId, id));

    return NextResponse.json({
      ...website,
      categoryIds: websiteCategs.map((c) => c.id),
      fontIds: websiteFontsList.map((f) => f.id),
      colorIds: websiteColorsList.map((c) => c.id),
    });
  } catch (error) {
    console.error("Error fetching website:", error);
    return NextResponse.json(
      { error: "Failed to fetch website" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const {
      title,
      description,
      screenshotUrl,
      websiteUrl,
      categories = [],
      fonts = [],
      colors = [],
    } = body;

    if (!title || !description || !screenshotUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    // Update website
    await db.run(sql`
      UPDATE websites 
      SET title = ${title}, 
          description = ${description}, 
          screenshot_url = ${screenshotUrl}, 
          website_url = ${websiteUrl || null}, 
          updated_at = ${now}
      WHERE id = ${id}
    `);

    // Delete existing relationships
    await db.run(sql`DELETE FROM website_categories WHERE website_id = ${id}`);
    await db.run(sql`DELETE FROM website_fonts WHERE website_id = ${id}`);
    await db.run(sql`DELETE FROM website_colors WHERE website_id = ${id}`);

    // Insert new relationships
    if (categories.length > 0) {
      for (const categoryId of categories) {
        await db.run(sql`
          INSERT INTO website_categories (website_id, category_id)
          VALUES (${id}, ${categoryId})
        `);
      }
    }

    if (fonts.length > 0) {
      for (const fontId of fonts) {
        await db.run(sql`
          INSERT INTO website_fonts (website_id, font_id)
          VALUES (${id}, ${fontId})
        `);
      }
    }

    if (colors.length > 0) {
      for (const colorId of colors) {
        await db.run(sql`
          INSERT INTO website_colors (website_id, color_id)
          VALUES (${id}, ${colorId})
        `);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating website:", error);
    return NextResponse.json(
      { error: "Failed to update website" },
      { status: 500 }
    );
  }
}
