import { joinFullName } from "@/lib/profile-name";
import type { ProfileFormValues } from "@/types/profile.api";

type SessionLike = {
  fullName?: string;
  userName?: string;
} | null;

export function getProfileDisplayName(
  profile: ProfileFormValues | null,
  session: SessionLike
): string {
  if (profile) {
    const fromForm = joinFullName(profile.firstName, profile.lastName);
    if (fromForm) return fromForm;
  }

  return (
    session?.fullName?.trim() || session?.userName?.trim() || "کاربر"
  );
}

export function getProfileAvatarUrl(
  profile: ProfileFormValues | null
): string | null {
  return profile?.avatarUrl ?? null;
}
