import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">MuseRaft</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover curated marketing website screenshots, sections,
            dashboards, and user flows for your design inspiration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/websites">Browse Websites</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Websites</CardTitle>
              <CardDescription>
                Full marketing website screenshots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/websites">Explore →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>
                Hero sections, pricing, testimonials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/sections">Explore →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboards</CardTitle>
              <CardDescription>
                Admin panels and analytics views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboards">Explore →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flows</CardTitle>
              <CardDescription>
                Multi-step user flows and journeys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/flows">Explore →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
