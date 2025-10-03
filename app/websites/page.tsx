import { ScreenshotCard } from "@/components/gallery/screenshot-card";
import { Pagination } from "@/components/gallery/pagination";
import { UpgradeDialog } from "@/components/subscription/upgrade-dialog";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { getSession } from "@/lib/auth/utils";

interface Website {
  id: string;
  title: string;
  description: string;
  screenshotUrl: string;
  websiteUrl: string | null;
  createdAt: number;
}

async function getWebsites(
  page: number = 1,
  filters: { category?: string; font?: string; color?: string } = {}
) {
  const params = new URLSearchParams({ page: page.toString() });
  if (filters.category) params.set("category", filters.category);
  if (filters.font) params.set("font", filters.font);
  if (filters.color) params.set("color", filters.color);

  const res = await fetch(
    `http://localhost:3000/api/websites?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch websites");
  }

  return res.json();
}

async function getFilters() {
  const res = await fetch("http://localhost:3000/api/filters?type=website", {
    cache: "no-store",
  });

  if (!res.ok) {
    return { categories: [], fonts: [], colors: [], layoutTypes: [] };
  }

  return res.json();
}

export default async function WebsitesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    font?: string;
    color?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const filters = {
    category: params.category,
    font: params.font,
    color: params.color,
  };

  const [{ data, pagination }, filterOptions, session] = await Promise.all([
    getWebsites(currentPage, filters),
    getFilters(),
    getSession(),
  ]);

  const isFreeUser =
    !session?.user || session.user.subscriptionStatus === "free";
  const shouldShowUpgrade = isFreeUser && currentPage === 3;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Websites</h1>
        <p className="text-muted-foreground">
          Explore curated marketing website screenshots
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          categories={filterOptions.categories}
          fonts={filterOptions.fonts}
          colors={filterOptions.colors}
          type="website"
        />

        <div className="flex-1">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No websites found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((website: Website) => (
                  <ScreenshotCard
                    key={website.id}
                    id={website.id}
                    title={website.title}
                    description={website.description}
                    screenshotUrl={website.screenshotUrl}
                    websiteUrl={website.websiteUrl || undefined}
                    createdAt={website.createdAt}
                    type="website"
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </>
          )}
        </div>
      </div>

      {shouldShowUpgrade && <UpgradeDialog currentPage={currentPage} />}
    </div>
  );
}
