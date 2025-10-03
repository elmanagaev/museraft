"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalImageUpload } from "@/components/upload/local-image-upload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FilterOption {
  id: string;
  name: string;
}

export default function EditWebsitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [fonts, setFonts] = useState<FilterOption[]>([]);
  const [colors, setColors] = useState<FilterOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    screenshotUrl: "",
    websiteUrl: "",
  });

  useEffect(() => {
    async function init() {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      // Fetch filters
      const filtersRes = await fetch("/api/filters?type=website");
      const filtersData = await filtersRes.json();
      setCategories(filtersData.categories || []);
      setFonts(filtersData.fonts || []);
      setColors(filtersData.colors || []);

      // Fetch website data
      const websiteRes = await fetch(
        `/api/admin/websites/${resolvedParams.id}`
      );
      if (websiteRes.ok) {
        const website = await websiteRes.json();
        setFormData({
          title: website.title || "",
          description: website.description || "",
          screenshotUrl: website.screenshotUrl || "",
          websiteUrl: website.websiteUrl || "",
        });
        setSelectedCategories(website.categoryIds || []);
        setSelectedFonts(website.fontIds || []);
        setSelectedColors(website.colorIds || []);
      }
      setIsLoading(false);
    }
    init();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.screenshotUrl) {
      setError("Please upload a screenshot");
      return;
    }

    setIsLoading(true);

    const data = {
      ...formData,
      categories: selectedCategories,
      fonts: selectedFonts,
      colors: selectedColors,
    };

    try {
      const response = await fetch(`/api/admin/websites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message || "Failed to update website");
        return;
      }

      router.push("/admin/websites");
      router.refresh();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/websites">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Websites
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Website</h1>
        <p className="text-muted-foreground">Update website details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshot Image *</Label>
              <LocalImageUpload
                value={formData.screenshotUrl}
                onChange={(url) =>
                  setFormData({ ...formData, screenshotUrl: url })
                }
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Upload image to local storage (max 4MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-3 border rounded-md p-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            cat.id,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((id) => id !== cat.id)
                          );
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={`cat-${cat.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fonts</Label>
              <div className="grid grid-cols-2 gap-3 border rounded-md p-4">
                {fonts.map((font) => (
                  <div key={font.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`font-${font.id}`}
                      checked={selectedFonts.includes(font.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFonts([...selectedFonts, font.id]);
                        } else {
                          setSelectedFonts(
                            selectedFonts.filter((id) => id !== font.id)
                          );
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={`font-${font.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {font.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="grid grid-cols-2 gap-3 border rounded-md p-4">
                {colors.map((color) => (
                  <div key={color.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color.id}`}
                      checked={selectedColors.includes(color.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColors([...selectedColors, color.id]);
                        } else {
                          setSelectedColors(
                            selectedColors.filter((id) => id !== color.id)
                          );
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={`color-${color.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {color.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Website"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
