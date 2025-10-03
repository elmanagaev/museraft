import { db } from "@/lib/db";
import { websites, sections, dashboards, flows, users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Layers, Monitor, GitBranch, Users } from "lucide-react";

async function getStats() {
  const [
    websitesCount,
    sectionsCount,
    dashboardsCount,
    flowsCount,
    usersCount,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(websites),
    db.select({ count: sql<number>`count(*)` }).from(sections),
    db.select({ count: sql<number>`count(*)` }).from(dashboards),
    db.select({ count: sql<number>`count(*)` }).from(flows),
    db.select({ count: sql<number>`count(*)` }).from(users),
  ]);

  return {
    websites: websitesCount[0].count,
    sections: sectionsCount[0].count,
    dashboards: dashboardsCount[0].count,
    flows: flowsCount[0].count,
    users: usersCount[0].count,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Websites",
      value: stats.websites,
      icon: Image,
      href: "/admin/websites",
    },
    {
      title: "Sections",
      value: stats.sections,
      icon: Layers,
      href: "/admin/sections",
    },
    {
      title: "Dashboards",
      value: stats.dashboards,
      icon: Monitor,
      href: "/admin/dashboards",
    },
    {
      title: "Flows",
      value: stats.flows,
      icon: GitBranch,
      href: "/admin/flows",
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your content and users
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
