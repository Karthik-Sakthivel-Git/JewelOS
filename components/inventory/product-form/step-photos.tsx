"use client";

import { useState, useRef } from "react";
import { Upload, X, ImagePlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface Props {
  form: UseFormReturn<FieldValues>;
}

const MAX_PHOTOS = 8;
const MIN_PHOTOS = 2;

export function StepPhotos({ form }: Props) {
  const { watch, setValue } = form;
  const images = watch("images") ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    if (images.length + files.length > MAX_PHOTOS) return;
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      // Preview via object URL (production would upload to R2)
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    }

    setValue("images", [...images, ...newUrls]);
    setUploading(false);
  }

  function removeImage(index: number) {
    const next = images.filter((_: string, i: number) => i !== index);
    setValue("images", next);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Product Photos</h3>
        <p className="text-sm text-gray-500">
          Add {MIN_PHOTOS}-{MAX_PHOTOS} photos. First image becomes the thumbnail.
        </p>
      </div>

      {images.length < MIN_PHOTOS && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Minimum {MIN_PHOTOS} photos required ({MIN_PHOTOS - images.length} more needed)
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((url: string, idx: number) => (
          <div
            key={idx}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl border-2",
              idx === 0 ? "border-gold-400" : "border-gray-200"
            )}
          >
            <img
              src={url}
              alt={`Product photo ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            {idx === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-white">
                THUMBNAIL
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Upload zone */}
        {images.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gold-400 hover:bg-gold-50/30"
          >
            {uploading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            ) : (
              <>
                <ImagePlus className="h-8 w-8 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
        }}
        className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-8 text-center"
      >
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            Drag & drop photos here, or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-medium text-maroon-800 hover:underline"
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {images.length}/{MAX_PHOTOS} photos uploaded
          </p>
        </div>
      </div>
    </div>
  );
}
