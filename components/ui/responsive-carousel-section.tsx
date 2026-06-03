"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type DesktopLayout = "grid" | "wrap";

interface ResponsiveCarouselSectionProps {
  children: React.ReactNode;
  className?: string;
  desktop?: DesktopLayout;
  gridClassName?: string;
  /** Tailwind basis for each slide on mobile, e.g. "basis-[72%]" */
  slideBasis?: string;
  /** Group slides (e.g. 3 highlights per slide) */
  groupSize?: number;
}

const defaultCarouselOpts = {
  direction: "rtl" as const,
  align: "start" as const,
  containScroll: "trimSnaps" as const,
  dragFree: true,
};

export function ResponsiveCarouselSection({
  children,
  className,
  desktop = "wrap",
  gridClassName = "lg:grid-cols-6",
  slideBasis = "basis-[72%] sm:basis-[48%]",
  groupSize = 1,
}: ResponsiveCarouselSectionProps) {
  const items = React.Children.toArray(children);

  const slides =
    groupSize > 1
      ? Array.from(
          { length: Math.ceil(items.length / groupSize) },
          (_, i) => items.slice(i * groupSize, i * groupSize + groupSize)
        )
      : items.map((item) => [item]);

  return (
    <div className={cn("w-full min-w-0", className)}>
      {/* Mobile & tablet: carousel */}
      <div className="lg:hidden">
        <Carousel opts={defaultCarouselOpts} className="w-full">
          <div className="relative">
            <CarouselContent>
              {slides.map((slideItems, slideIndex) => (
                <CarouselItem
                  key={slideIndex}
                  className={cn(slideBasis, groupSize > 1 && "basis-[88%]")}
                >
                  {groupSize > 1 ? (
                    <div className="flex justify-center gap-4">
                      {slideItems}
                    </div>
                  ) : (
                    slideItems[0]
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      {/* Desktop: grid or wrap */}
      {desktop === "grid" ? (
        <div
          className={cn(
            "hidden w-full gap-3 lg:grid",
            gridClassName
          )}
        >
          {items}
        </div>
      ) : (
        <div className="hidden w-full flex-row flex-wrap items-center justify-center gap-2 lg:flex">
          {items}
        </div>
      )}
    </div>
  );
}
