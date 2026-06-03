import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        new: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        bestseller: "bg-red-500/15 text-red-600 dark:text-red-400",
        discount: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
        special: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
