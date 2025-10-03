"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Crown } from "lucide-react";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
    subscriptionStatus: "free" | "pro";
  };
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <>
      {user.subscriptionStatus === "free" && (
        <Button asChild variant="outline" size="sm">
          <Link href="/upgrade">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Link>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            {user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.subscriptionStatus === "pro" ? (
                  <span className="text-primary font-medium">Pro Account</span>
                ) : (
                  <span>Free Account</span>
                )}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
