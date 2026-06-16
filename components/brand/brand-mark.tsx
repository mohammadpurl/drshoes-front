import type { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  brand: Brand;
  className?: string;
  /** وقتی پس‌زمینه تیره/primary است */
  inverted?: boolean;
};

function MarkSvg({
  brand,
  className,
}: {
  brand: Brand;
  className?: string;
}) {
  const shared = cn("h-full w-full", className);

  switch (brand) {
    case "Adidas":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="currentColor"
            d="M4 4h3.2l1.6 16H4V4zm5.6 0h3.2l1.6 16H9.6V4zm5.6 0H20l-1.6 16h-3.2L14.2 4z"
          />
        </svg>
      );
    case "Nike":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="currentColor"
            d="M4.2 14.8c4.8-2.2 8.4-5.4 11.2-9.2.5 5.6-2.8 10.8-8.4 12.8-1 .4-2 .6-2.8.6z"
          />
        </svg>
      );
    case "On Running":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            fill="currentColor"
            d="M8.5 12.2h7v1.6h-7zm0-3.2h7v1.6h-7z"
          />
        </svg>
      );
    case "ASICS":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="currentColor"
            d="M3 18L9 6l3 6 3-6 6 12h-2.4l-3.6-7.2-3.6 7.2H3z"
          />
        </svg>
      );
    case "Hoka":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="currentColor"
            d="M5 5h14v3.2H11.8V11H18v3.2H11.8v4.8H5V5z"
          />
        </svg>
      );
    case "New Balance":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="currentColor"
            d="M4 5h6.5c3.2 0 5.2 1.6 5.2 4.2 0 1.6-.8 2.8-2.2 3.5L16 19H12l-3.2-5.4H8.2V19H4V5zm4.2 3.2v3.4h2c1.2 0 1.8-.5 1.8-1.7s-.6-1.7-1.8-1.7h-2z"
          />
        </svg>
      );
    case "Saucony":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="currentColor"
            d="M6 18c5.5-1.2 9.5-4.8 11-10.5L14 8.5C12.8 12 9.8 14.8 6 15.8V18z"
          />
          <circle cx="7" cy="8" r="2.2" fill="currentColor" />
        </svg>
      );
    case "Brooks":
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M4 14c3-4 6-6 10-6 3 0 5 2 6 5"
          />
          <path fill="currentColor" d="M5 16h14v2H5z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={shared} aria-hidden>
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.25" />
        </svg>
      );
  }
}

export function BrandMark({ brand, className, inverted }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        inverted ? "text-white" : "text-foreground",
        className
      )}
      aria-hidden
    >
      <MarkSvg brand={brand} />
    </span>
  );
}

type BrandLabelProps = {
  brand: Brand;
  showName?: boolean;
  size?: "xs" | "sm" | "md";
  inverted?: boolean;
  className?: string;
};

const sizeMap = {
  xs: { box: "h-4 w-4", text: "text-xs" },
  sm: { box: "h-5 w-5", text: "text-sm" },
  md: { box: "h-6 w-6", text: "text-sm" },
};

export function BrandLabel({
  brand,
  showName = true,
  size = "sm",
  inverted = false,
  className,
}: BrandLabelProps) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        inverted ? "text-white" : "text-inherit",
        className
      )}
    >
      <BrandMark brand={brand} inverted={inverted} className={s.box} />
      {showName && (
        <span className={cn("font-medium leading-none", s.text)}>{brand}</span>
      )}
    </span>
  );
}
