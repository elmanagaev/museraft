"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupabaseImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function SupabaseImageUpload({
  value,
  onChange,
  disabled,
}: SupabaseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      setError("File size must be less than 4MB");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full max-w-md rounded-lg border overflow-hidden">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center gap-2 cursor-pointer ${
              disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 4MB
            </p>
          </label>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
