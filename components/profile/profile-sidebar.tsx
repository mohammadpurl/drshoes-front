"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { useSessionStore } from "@/app/_store/auth-store";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { getProfileAvatarUrl, getProfileDisplayName } from "@/lib/profile-display";
import { PROFILE_NAV } from "@/lib/profile-nav";
import { useProfileStore } from "@/store/profile-store";
import { cn } from "@/lib/utils";

export function ProfileSidebar() {
  const pathname = usePathname();
  const session = useSessionStore((s) => s.session);
  const profile = useProfileStore((s) => s.profile);
  const displayName = getProfileDisplayName(profile, session);
  const avatarUrl = getProfileAvatarUrl(profile);

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 text-center">
        <ProfileAvatar
          src={avatarUrl}
          size="md"
          className="mx-auto mb-3"
        />
        <p className="font-bold">{displayName}</p>
        {session?.userName && (
          <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">
            {session.userName}
          </p>
        )}
      </div>

      <nav className="rounded-2xl border border-border bg-card p-2">
        <ul className="space-y-0.5">
          {PROFILE_NAV.map((item) => {
            const { href, label, icon: Icon } = item;
            const exact = "exact" in item && item.exact;
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span>{label}</span>
                  <Icon className="h-4 w-4 shrink-0 opacity-70" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        <Store className="h-4 w-4" />
        بازگشت به فروشگاه
      </Link>
    </aside>
  );
}
