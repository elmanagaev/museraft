"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, Check } from "lucide-react";

interface UpgradeDialogProps {
  currentPage: number;
}

export function UpgradeDialog({ currentPage }: UpgradeDialogProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (currentPage !== 3 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
          <CardDescription>
            Unlock unlimited access to all content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Unlimited Content Access</p>
                <p className="text-sm text-muted-foreground">
                  Browse all pages without restrictions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Premium Screenshots</p>
                <p className="text-sm text-muted-foreground">
                  Access exclusive high-quality screenshots
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Advanced Filters</p>
                <p className="text-sm text-muted-foreground">
                  Filter by categories, colors, fonts, and more
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" size="lg">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsVisible(false)}
          >
            Maybe Later
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
