import { db } from "@/lib/db";
import { flows, flowCategories, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getFlow(id: string) {
  const [flow] = await db.select().from(flows).where(eq(flows.id, id)).limit(1);

  if (!flow) return null;

  const flowCategs = await db
    .select({ name: categories.name })
    .from(flowCategories)
    .innerJoin(categories, eq(flowCategories.categoryId, categories.id))
    .where(eq(flowCategories.flowId, id));

  return {
    ...flow,
    categories: flowCategs.map((c) => c.name),
  };
}

export default async function FlowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flow = await getFlow(id);

  if (!flow) {
    notFound();
  }

  const screenshots = flow.screenshotUrls as string[];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/flows">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Flows
        </Link>
      </Button>

      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{flow.title}</h1>
          <p className="text-muted-foreground">{flow.description}</p>
        </div>

        <div className="space-y-6">
          {screenshots.map((url: string, index: number) => (
            <div
              key={index}
              className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={url}
                alt={`${flow.title} - Step ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {flow.categories.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {flow.categories.map((category) => (
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
          <span>
            Added on {formatDate(flow.createdAt)} • {screenshots.length} steps
          </span>
        </div>
      </div>
    </div>
  );
}
