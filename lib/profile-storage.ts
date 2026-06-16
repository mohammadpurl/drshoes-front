import type { ProfileFormValues } from "@/types/profile.api";

const STORAGE_KEY = "drshoes-profile-extra";

type StoredProfileExtra = Partial<
  Pick<
    ProfileFormValues,
    "email" | "nationalId" | "postalCode" | "addressLine" | "avatarUrl"
  > & { firstName: string; lastName: string }
>;

function readAll(): Record<string, StoredProfileExtra> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StoredProfileExtra>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, StoredProfileExtra>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProfileExtra(userId: string): StoredProfileExtra {
  return readAll()[userId] ?? {};
}

export function saveProfileExtra(
  userId: string,
  values: StoredProfileExtra
): void {
  const all = readAll();
  all[userId] = values;
  writeAll(all);
}
