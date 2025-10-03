import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fonts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allFonts = await db.select().from(fonts);
    return NextResponse.json(allFonts);
  } catch (error) {
    console.error("Error fetching fonts:", error);
    return NextResponse.json(
      { error: "Failed to fetch fonts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [newFont] = await db.insert(fonts).values({ name }).returning();

    return NextResponse.json(newFont, { status: 201 });
  } catch (error) {
    console.error("Error creating font:", error);
    return NextResponse.json(
      { error: "Failed to create font" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(fonts)
      .set({ name })
      .where(eq(fonts.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating font:", error);
    return NextResponse.json(
      { error: "Failed to update font" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(fonts).where(eq(fonts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting font:", error);
    return NextResponse.json(
      { error: "Failed to delete font" },
      { status: 500 }
    );
  }
}
