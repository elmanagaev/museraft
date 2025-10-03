import Link from "next/link";
import { getSession } from "@/lib/auth/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

export async function Header() {
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error("Session error:", error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">MuseRaft</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/websites"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Websites
            </Link>
            <Link
              href="/sections"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sections
            </Link>
            <Link
              href="/dashboards"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboards
            </Link>
            <Link
              href="/flows"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Flows
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
