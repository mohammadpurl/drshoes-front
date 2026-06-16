"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  loading?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "تأیید",
  cancelLabel = "انصراف",
  confirmVariant = "default",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader className="text-start">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <p className="pt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </DialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            disabled={loading}
            className={cn(
              confirmVariant === "destructive" &&
                "bg-destructive text-white hover:bg-destructive/90"
            )}
            onClick={onConfirm}
          >
            {loading ? "در حال انجام..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
