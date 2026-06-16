import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminDesktopTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hidden overflow-x-auto rounded-2xl border border-border bg-card md:block",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminMobileCards({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3 md:hidden", className)}>{children}</div>;
}

export function AdminMobileCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 text-sm",
        onClick && "cursor-pointer transition active:bg-muted/40",
        className
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function AdminCardRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 border-b border-border/60 py-2 last:border-0 last:pb-0 first:pt-0",
        className
      )}
    >
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="min-w-0 text-end">{children}</div>
    </div>
  );
}
