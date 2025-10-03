import { db } from "@/lib/db";
import { sections, sectionCategories, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getSection(id: string) {
  const [section] = await db
    .select()
    .from(sections)
    .where(eq(sections.id, id))
    .limit(1);

  if (!section) return null;

  const sectionCategs = await db
    .select({ name: categories.name })
    .from(sectionCategories)
    .innerJoin(categories, eq(sectionCategories.categoryId, categories.id))
    .where(eq(sectionCategories.sectionId, id));

  return {
    ...section,
    categories: sectionCategs.map((c) => c.name),
  };
}

export default async function SectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const section = await getSection(id);

  if (!section) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/sections">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sections
        </Link>
      </Button>

      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{section.title}</h1>
          <p className="text-muted-foreground">{section.description}</p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={section.screenshotUrl}
            alt={section.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {section.categories.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground border-t pt-4">
          <span>Added on {formatDate(section.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
