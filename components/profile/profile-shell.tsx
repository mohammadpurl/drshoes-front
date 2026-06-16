"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";

type ProfileShellProps = {
  title?: string;
  children: React.ReactNode;
  showNav?: boolean;
};

export function ProfileShell({
  title,
  children,
  showNav = true,
}: ProfileShellProps) {
  const router = useRouter();

  return (
    <>
      <Header
        search=""
        onSearchChange={(q) => {
          if (q) router.push(`/?q=${encodeURIComponent(q)}`);
        }}
      />
      <main className="page-container mx-auto max-w-4xl pb-24 pt-4 md:pb-8">
        {showNav ? (
          <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
            <ProfileSidebar />
            <div className="min-w-0">
              {title ? (
                <h1 className="mb-5 text-xl font-bold">{title}</h1>
              ) : null}
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
