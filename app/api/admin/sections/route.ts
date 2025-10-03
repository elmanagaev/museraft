import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sections, sectionCategories } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();

    const allSections = await db
      .select({
        id: sections.id,
        title: sections.title,
        description: sections.description,
        screenshotUrl: sections.screenshotUrl,
        createdAt: sections.createdAt,
      })
      .from(sections)
      .orderBy(sections.createdAt);

    return NextResponse.json(allSections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await request.json();
    const { title, description, screenshotUrl, categories } = body;

    if (!title || !description || !screenshotUrl) {
      return NextResponse.json(
        { error: "Title, description, and screenshot are required" },
        { status: 400 }
      );
    }

    const [newSection] = await db
      .insert(sections)
      .values({
        title,
        description,
        screenshotUrl,
        createdBy: session.user.id,
      })
      .returning();

    // Insert category relationships
    if (categories && categories.length > 0) {
      await db.insert(sectionCategories).values(
        categories.map((categoryId: string) => ({
          sectionId: newSection.id,
          categoryId,
        }))
      );
    }

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}
