"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { uploadProductMediaAction } from "@/app/_actions/product-media-actions";
import { isVideoUrl } from "@/lib/media-upload";
import { notifyError } from "@/lib/notify-action";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProductMediaUploadProps {
  slug: string;
  images: string[];
  videos: string[];
  onImagesChange: (urls: string[]) => void;
  onVideosChange: (urls: string[]) => void;
}

export function ProductMediaUpload({
  slug,
  images,
  videos,
  onImagesChange,
  onVideosChange,
}: ProductMediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    if (!slug.trim()) {
      notifyError("قبل از آپلود، اسلاگ محصول را وارد کنید.");
      return;
    }

    setUploading(true);
    const nextImages = [...images];
    const nextVideos = [...videos];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", slug.trim());

      const result = await uploadProductMediaAction(formData);
      if (!result.success) {
        notifyError(result.error);
        continue;
      }

      if (result.data.kind === "video") {
        nextVideos.push(result.data.url);
      } else {
        nextImages.push(result.data.url);
      }
    }

    onImagesChange(nextImages);
    onVideosChange(nextVideos);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const allMedia = [
    ...images.map((url) => ({ url, kind: "image" as const })),
    ...videos.map((url) => ({ url, kind: "video" as const })),
  ];

  const removeAt = (url: string, kind: "image" | "video") => {
    if (kind === "video") {
      onVideosChange(videos.filter((u) => u !== url));
    } else {
      onImagesChange(images.filter((u) => u !== url));
    }
  };

  return (
    <div className="space-y-3">
      <Label>تصاویر و ویدئوهای محصول</Label>
      <p className="text-xs text-muted-foreground">
        فایل را انتخاب کنید. با بک‌اند فعال در{" "}
        <code dir="ltr" className="rounded bg-muted px-1">
          /static/products/
        </code>{" "}
        ذخیره می‌شود.
      </p>

      <div
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50",
          uploading && "pointer-events-none opacity-60"
        )}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
        )}
        <span className="text-sm font-medium">
          {uploading ? "در حال آپلود..." : "انتخاب تصویر یا ویدئو"}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {!slug.trim() && (
        <p className="text-xs text-amber-600">
          برای آپلود، ابتدا فیلد اسلاگ را پر کنید.
        </p>
      )}

      {allMedia.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {allMedia.map(({ url, kind }) => (
            <li
              key={`${kind}-${url}`}
              className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
            >
              {kind === "video" || isVideoUrl(url) ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">ویدئو</span>
                  <video
                    src={url}
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                    muted
                    playsInline
                  />
                </div>
              ) : (
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                  unoptimized
                />
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute end-2 top-2 h-8 w-8 bg-destructive/90 text-destructive-foreground opacity-90 hover:bg-destructive"
                onClick={() => removeAt(url, kind)}
                aria-label="حذف فایل"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
