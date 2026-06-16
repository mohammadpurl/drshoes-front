"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import { createProductReviewAction } from "@/app/_actions/product-actions";
import { useSessionStore } from "@/app/_store/auth-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { notifyError, notifySuccess } from "@/lib/notify-action";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductReviewFormProps = {
  slug: string;
  onCreated: (review: Review) => void;
};

export function ProductReviewForm({ slug, onCreated }: ProductReviewFormProps) {
  const status = useSessionStore((s) => s.status);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  if (status === "loading") {
    return null;
  }

  if (status !== "authenticated") {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm">
        <p className="text-muted-foreground">
          برای ثبت نظر باید وارد حساب کاربری شوید.
        </p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link href={`/login?redirect=/products/${slug}`}>ورود / ثبت‌نام</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = comment.trim();
    if (trimmed.length < 3) {
      notifyError("متن نظر باید حداقل ۳ کاراکتر باشد");
      return;
    }

    startTransition(async () => {
      const result = await createProductReviewAction(slug, {
        rating,
        comment: trimmed,
      });
      if (result.success) {
        notifySuccess("نظر شما ثبت شد");
        setComment("");
        setRating(5);
        onCreated(result.data);
        return;
      }
      notifyError(result.error);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-4"
    >
      <h3 className="mb-3 font-semibold">ثبت نظر</h3>

      <div className="mb-4 space-y-2">
        <Label>امتیاز شما</Label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                type="button"
                className="rounded p-1 transition hover:bg-muted"
                onClick={() => setRating(value)}
                aria-label={`${value} ستاره`}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    value <= rating
                      ? "fill-highlight text-highlight"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-comment">متن نظر</Label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="تجربه خود از این کفش را بنویسید..."
          className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          maxLength={2000}
          required
        />
      </div>

      <Button type="submit" className="mt-4" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال ارسال...
          </>
        ) : (
          "ارسال نظر"
        )}
      </Button>
    </form>
  );
}
