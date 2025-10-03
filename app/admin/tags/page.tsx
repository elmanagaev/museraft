"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Plus, X } from "lucide-react";

type Tag = {
  id: string;
  name: string;
  type?: string;
};

type TagType =
  | "website-categories"
  | "section-categories"
  | "dashboard-categories"
  | "flow-categories"
  | "fonts"
  | "colors";

export default function TagsManagementPage() {
  const [activeTab, setActiveTab] = useState<TagType>("website-categories");
  const [categories, setCategories] = useState<Tag[]>([]);
  const [fonts, setFonts] = useState<Tag[]>([]);
  const [colors, setColors] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      const [catRes, fontRes, colorRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/fonts"),
        fetch("/api/admin/colors"),
      ]);

      const allCategories = await catRes.json();
      setCategories(allCategories);
      setFonts(await fontRes.json());
      setColors(await colorRes.json());
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;

    setError("");

    const isCategoryType = activeTab.includes("categories");
    const endpoint = isCategoryType
      ? "/api/admin/categories"
      : `/api/admin/${activeTab}`;

    try {
      const body: any = { name: newName };

      if (isCategoryType) {
        // Extract the type from activeTab (e.g., "website-categories" -> "website")
        body.type = activeTab.replace("-categories", "");
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to add");

      setNewName("");
      await fetchAllTags();
    } catch (error) {
      setError("Failed to add item");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    setError("");

    const isCategoryType = activeTab.includes("categories");
    const endpoint = isCategoryType
      ? "/api/admin/categories"
      : `/api/admin/${activeTab}`;

    try {
      const item = getCurrentList().find((t) => t.id === id);
      const body: any = { id, name: editingName };

      if (isCategoryType && item) {
        body.type = item.type || activeTab.replace("-categories", "");
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEditingId(null);
      setEditingName("");
      await fetchAllTags();
    } catch (error) {
      setError("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setError("");

    const isCategoryType = activeTab.includes("categories");
    const endpoint = isCategoryType
      ? `/api/admin/categories?id=${id}`
      : `/api/admin/${activeTab}?id=${id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchAllTags();
    } catch (error) {
      setError("Failed to delete item");
    }
  };

  const getCurrentList = () => {
    switch (activeTab) {
      case "website-categories":
        return categories.filter((c) => c.type === "website");
      case "section-categories":
        return categories.filter((c) => c.type === "section");
      case "dashboard-categories":
        return categories.filter((c) => c.type === "dashboard");
      case "flow-categories":
        return categories.filter((c) => c.type === "flow");
      case "fonts":
        return fonts;
      case "colors":
        return colors;
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const currentList = getCurrentList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tag Management</h1>
        <p className="text-muted-foreground">
          Manage categories, fonts, and colors
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2 border-b flex-wrap">
        <Button
          variant={activeTab === "website-categories" ? "default" : "ghost"}
          onClick={() => setActiveTab("website-categories")}
          size="sm"
        >
          Website Categories
        </Button>
        <Button
          variant={activeTab === "section-categories" ? "default" : "ghost"}
          onClick={() => setActiveTab("section-categories")}
          size="sm"
        >
          Section Categories
        </Button>
        <Button
          variant={activeTab === "dashboard-categories" ? "default" : "ghost"}
          onClick={() => setActiveTab("dashboard-categories")}
          size="sm"
        >
          Dashboard Categories
        </Button>
        <Button
          variant={activeTab === "flow-categories" ? "default" : "ghost"}
          onClick={() => setActiveTab("flow-categories")}
          size="sm"
        >
          Flow Categories
        </Button>
        <Button
          variant={activeTab === "fonts" ? "default" : "ghost"}
          onClick={() => setActiveTab("fonts")}
          size="sm"
        >
          Fonts
        </Button>
        <Button
          variant={activeTab === "colors" ? "default" : "ghost"}
          onClick={() => setActiveTab("colors")}
          size="sm"
        >
          Colors
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Add new ${activeTab.slice(0, -1)}...`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {currentList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                {editingId === item.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleUpdate(item.id)
                      }
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdate(item.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingName(item.name);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {currentList.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No {activeTab} yet. Add one above!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
