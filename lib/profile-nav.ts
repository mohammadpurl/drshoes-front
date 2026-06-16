import { MapPin, Package, Settings, User } from "lucide-react";

export const PROFILE_NAV = [
  {
    href: "/profile",
    label: "پنل کاربری",
    icon: User,
    exact: true,
  },
  {
    href: "/profile/orders",
    label: "سفارش‌های من",
    icon: Package,
  },
  {
    href: "/profile/addresses",
    label: "آدرس‌ها",
    icon: MapPin,
  },
  {
    href: "/profile/settings",
    label: "ویرایش پروفایل",
    icon: Settings,
  },
] as const;
