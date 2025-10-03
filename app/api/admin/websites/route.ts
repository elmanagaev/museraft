import { NextRequest, NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const websiteId = crypto.randomUUID();

    // Insert the website
    await db.run(sql`
      INSERT INTO websites (id, title, description, screenshot_url, website_url, created_at, updated_at, created_by)
      VALUES (${websiteId}, ${title}, ${description}, ${screenshotUrl}, ${
      websiteUrl || null
    }, ${now}, ${now}, ${userId})
    `);

    // Insert category relationships
    if (categories.length > 0) {
      for (const categoryId of categories) {
        await db.run(sql`
          INSERT INTO website_categories (website_id, category_id)
          VALUES (${websiteId}, ${categoryId})
        `);
      }
    }

    // Insert font relationships
    if (fonts.length > 0) {
      for (const fontId of fonts) {
        await db.run(sql`
          INSERT INTO website_fonts (website_id, font_id)
          VALUES (${websiteId}, ${fontId})
        `);
      }
    }

    // Insert color relationships
    if (colors.length > 0) {
      for (const colorId of colors) {
        await db.run(sql`
          INSERT INTO website_colors (website_id, color_id)
          VALUES (${websiteId}, ${colorId})
        `);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { error: "Failed to create website" },
      { status: 500 }
    );
  }
}
