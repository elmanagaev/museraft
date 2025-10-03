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
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getWebsite(id: string) {
  const [website] = await db
    .select()
    .from(websites)
    .where(eq(websites.id, id))
    .limit(1);

  if (!website) return null;

  // Get categories
  const websiteCategs = await db
    .select({ name: categories.name })
    .from(websiteCategories)
    .innerJoin(categories, eq(websiteCategories.categoryId, categories.id))
    .where(eq(websiteCategories.websiteId, id));

  // Get fonts
  const websiteFontsList = await db
    .select({ name: fonts.name })
    .from(websiteFonts)
    .innerJoin(fonts, eq(websiteFonts.fontId, fonts.id))
    .where(eq(websiteFonts.websiteId, id));

  // Get colors
  const websiteColorsList = await db
    .select({ name: colors.name })
    .from(websiteColors)
    .innerJoin(colors, eq(websiteColors.colorId, colors.id))
    .where(eq(websiteColors.websiteId, id));

  return {
    ...website,
    categories: websiteCategs.map((c) => c.name),
    fonts: websiteFontsList.map((f) => f.name),
    colors: websiteColorsList.map((c) => c.name),
  };
}

export default async function WebsiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const website = await getWebsite(id);

  if (!website) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/websites">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Websites
        </Link>
      </Button>

      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{website.title}</h1>
          <p className="text-muted-foreground">{website.description}</p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={website.screenshotUrl}
            alt={website.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {(website.categories.length > 0 ||
          website.fonts.length > 0 ||
          website.colors.length > 0) && (
          <div className="space-y-4 border rounded-lg p-4">
            {website.categories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {website.categories.map((category) => (
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
            {website.fonts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Fonts</h3>
                <div className="flex flex-wrap gap-2">
                  {website.fonts.map((font) => (
                    <span
                      key={font}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {font}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {website.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {website.colors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <span>Added on {formatDate(website.createdAt)}</span>
          {website.websiteUrl && (
            <Button asChild variant="outline">
              <a
                href={website.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
