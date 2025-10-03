"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

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
        <UploadDropzone<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          url="/api/uploadthing"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              onChange(res[0].url);
            }
            setIsUploading(false);
          }}
          onUploadError={(error: Error) => {
            alert(`Upload failed: ${error.message}`);
            setIsUploading(false);
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          disabled={disabled || isUploading}
          config={{ mode: "auto" }}
        />
      )}
    </div>
  );
}
