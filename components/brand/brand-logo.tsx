import Image from "next/image";
import type { Brand } from "@/lib/types";
import { getBrandLogoPath } from "@/lib/brand-logos";
import { OnRunningLogo } from "@/components/brand/logos/on-running-logo";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  brand: Brand;
  size?: number;
  inverted?: boolean;
  /** لوگوی افقی در نوار برند */
  strip?: boolean;
  /** نمایش بزرگ‌تر در پنل فیلتر */
  prominent?: boolean;
  className?: string;
};

export function BrandLogo({
  brand,
  size = 24,
  inverted = false,
  strip = false,
  prominent = false,
  className,
}: BrandLogoProps) {
  const width = prominent ? 128 : strip ? 88 : size;
  const height = prominent ? 44 : size;

  const logoClassName = cn(
    "shrink-0 object-contain",
    strip && "h-6 w-auto max-w-[4.5rem] sm:h-7 sm:max-w-[5.5rem] md:h-8",
    prominent && "h-11 w-auto max-w-[8rem] object-contain",
    inverted && "brightness-0 invert",
    !inverted && brand === "On Running" && "text-foreground",
    inverted && brand === "On Running" && "text-white",
    className
  );

  if (brand === "On Running") {
    return (
      <OnRunningLogo
        width={width}
        height={height}
        className={logoClassName}
      />
    );
  }

  return (
    <Image
      src={getBrandLogoPath(brand)}
      alt={`لوگوی ${brand}`}
      width={width}
      height={height}
      className={logoClassName}
    />
  );
}
