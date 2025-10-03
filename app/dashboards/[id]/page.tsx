import { db } from "@/lib/db";
import {
  dashboards,
  dashboardCategories,
  dashboardColors,
  dashboardLayoutTypes,
  categories,
  colors,
  layoutTypes,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getDashboard(id: string) {
  const [dashboard] = await db
    .select()
    .from(dashboards)
    .where(eq(dashboards.id, id))
    .limit(1);

  if (!dashboard) return null;

  const dashboardCategs = await db
    .select({ name: categories.name })
    .from(dashboardCategories)
    .innerJoin(categories, eq(dashboardCategories.categoryId, categories.id))
    .where(eq(dashboardCategories.dashboardId, id));

  const dashboardColorsList = await db
    .select({ name: colors.name })
    .from(dashboardColors)
    .innerJoin(colors, eq(dashboardColors.colorId, colors.id))
    .where(eq(dashboardColors.dashboardId, id));

  const dashboardLayouts = await db
    .select({ name: layoutTypes.name })
    .from(dashboardLayoutTypes)
    .innerJoin(
      layoutTypes,
      eq(dashboardLayoutTypes.layoutTypeId, layoutTypes.id)
    )
    .where(eq(dashboardLayoutTypes.dashboardId, id));

  return {
    ...dashboard,
    categories: dashboardCategs.map((c) => c.name),
    colors: dashboardColorsList.map((c) => c.name),
    layoutTypes: dashboardLayouts.map((l) => l.name),
  };
}

export default async function DashboardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dashboard = await getDashboard(id);

  if (!dashboard) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboards">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboards
        </Link>
      </Button>

      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{dashboard.title}</h1>
          <p className="text-muted-foreground">{dashboard.description}</p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={dashboard.screenshotUrl}
            alt={dashboard.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {(dashboard.categories.length > 0 ||
          dashboard.colors.length > 0 ||
          dashboard.layoutTypes.length > 0) && (
          <div className="space-y-4 border rounded-lg p-4">
            {dashboard.categories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dashboard.categories.map((category) => (
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
            {dashboard.layoutTypes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Layout Types</h3>
                <div className="flex flex-wrap gap-2">
                  {dashboard.layoutTypes.map((layout) => (
                    <span
                      key={layout}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {layout}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {dashboard.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {dashboard.colors.map((color) => (
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

        <div className="text-sm text-muted-foreground border-t pt-4">
          <span>Added on {formatDate(dashboard.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
