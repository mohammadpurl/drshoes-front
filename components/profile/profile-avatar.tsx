"use client";

import Image from "next/image";
import { UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
} as const;

const iconMap = {
  sm: "h-5 w-5",
  md: "h-9 w-9",
  lg: "h-14 w-14",
} as const;

export function ProfileAvatar({
  src,
  size = "md",
  className,
}: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10",
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <UserCircle className={cn("text-primary", iconMap[size])} />
      )}
    </div>
  );
}
