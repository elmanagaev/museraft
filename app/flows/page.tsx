import { ScreenshotCard } from "@/components/gallery/screenshot-card";
import { Pagination } from "@/components/gallery/pagination";
import { UpgradeDialog } from "@/components/subscription/upgrade-dialog";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { getSession } from "@/lib/auth/utils";

interface Flow {
  id: string;
  title: string;
  description: string;
  screenshotUrls: string;
  createdAt: number;
}

async function getFlows(page: number = 1, filters: { category?: string } = {}) {
  const params = new URLSearchParams({ page: page.toString() });
  if (filters.category) params.set("category", filters.category);

  const res = await fetch(
    `http://localhost:3000/api/flows?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch flows");
  }

  return res.json();
}

async function getFilters() {
  const res = await fetch("http://localhost:3000/api/filters?type=flow", {
    cache: "no-store",
  });

  if (!res.ok) {
    return { categories: [], fonts: [], colors: [], layoutTypes: [] };
  }

  return res.json();
}

export default async function FlowsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const filters = { category: params.category };

  const [{ data, pagination }, filterOptions, session] = await Promise.all([
    getFlows(currentPage, filters),
    getFilters(),
    getSession(),
  ]);

  const isFreeUser =
    !session?.user || session.user.subscriptionStatus === "free";
  const shouldShowUpgrade = isFreeUser && currentPage === 3;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Flows</h1>
        <p className="text-muted-foreground">
          Explore multi-step user flows and journeys
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar categories={filterOptions.categories} type="flow" />

        <div className="flex-1">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No flows found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((flow: Flow) => {
                  const urls = JSON.parse(flow.screenshotUrls);
                  const firstScreenshot = urls[0] || "/placeholder.jpg";

                  return (
                    <ScreenshotCard
                      key={flow.id}
                      id={flow.id}
                      title={flow.title}
                      description={flow.description}
                      screenshotUrl={firstScreenshot}
                      createdAt={flow.createdAt}
                      type="flow"
                    />
                  );
                })}
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
