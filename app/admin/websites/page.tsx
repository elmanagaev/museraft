import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getWebsites() {
  return await db
    .select()
    .from(websites)
    .orderBy(desc(websites.createdAt))
    .limit(50);
}

export default async function AdminWebsitesPage() {
  const websitesList = await getWebsites();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Websites</h1>
          <p className="text-muted-foreground">Manage website screenshots</p>
        </div>
        <Button asChild>
          <Link href="/admin/websites/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Website
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {websitesList.map((website) => (
          <Card key={website.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{website.title}</CardTitle>
                  <CardDescription>{website.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/websites/${website.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Screenshot:</span>{" "}
                  {website.screenshotUrl}
                </div>
                {website.websiteUrl && (
                  <div>
                    <span className="font-medium">URL:</span>{" "}
                    <a
                      href={website.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {website.websiteUrl}
                    </a>
                  </div>
                )}
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(website.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
