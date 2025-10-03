import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { colors } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allColors = await db.select().from(colors);
    return NextResponse.json(allColors);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json(
      { error: "Failed to fetch colors" },
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

    const [newColor] = await db.insert(colors).values({ name }).returning();

    return NextResponse.json(newColor, { status: 201 });
  } catch (error) {
    console.error("Error creating color:", error);
    return NextResponse.json(
      { error: "Failed to create color" },
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
      .update(colors)
      .set({ name })
      .where(eq(colors.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating color:", error);
    return NextResponse.json(
      { error: "Failed to update color" },
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

    await db.delete(colors).where(eq(colors.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting color:", error);
    return NextResponse.json(
      { error: "Failed to delete color" },
      { status: 500 }
    );
  }
}
