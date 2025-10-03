"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ScreenshotCardProps {
  id: string;
  title: string;
  description: string;
  screenshotUrl: string;
  websiteUrl?: string;
  createdAt: Date | number;
  type: "website" | "section" | "dashboard" | "flow";
}

export function ScreenshotCard({
  id,
  title,
  description,
  screenshotUrl,
  websiteUrl,
  createdAt,
  type,
}: ScreenshotCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/${type}s/${id}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={screenshotUrl}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="line-clamp-1">
          <Link href={`/${type}s/${id}`} className="hover:text-primary">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(createdAt)}</span>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Visit
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
