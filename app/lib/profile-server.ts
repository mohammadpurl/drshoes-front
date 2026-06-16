import {
  deleteDataWithAuth,
  uploadDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import type { ApiError } from "@/types/http-errors.interface";

const AVATAR_PATH = "/profile/avatar";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type ProfileAvatarResponse = {
  avatarUrl?: string;
  avatar_url?: string;
  url?: string;
};

export function extractProfileErrorMessage(err: unknown): string {
  return extractActionErrorMessage(err, "خطا در پردازش تصویر پروفایل");
}

function validateAvatarFile(file: File): void {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("فرمت مجاز: JPG، PNG، WebP یا GIF");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("حجم تصویر باید حداکثر ۲ مگابایت باشد");
  }
}

export async function uploadProfileAvatarFile(
  file: File
): Promise<ProfileAvatarResponse> {
  validateAvatarFile(file);
  const formData = new FormData();
  formData.append("file", file);
  return uploadDataWithAuth<ProfileAvatarResponse>(AVATAR_PATH, formData);
}

export async function deleteProfileAvatarRemote(): Promise<void> {
  await deleteDataWithAuth(AVATAR_PATH);
}

export function isProfileApiError(err: unknown): err is ApiError {
  return typeof err === "object" && err !== null && "status" in err;
}
