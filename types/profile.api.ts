/** `GET /auth/me` — فیلدهای اضافی اختیاری برای نسخه‌های بعدی API */
export type CustomerProfileRead = {
  id: string;
  username: string;
  full_name: string;
  phone: string;
  email?: string | null;
  is_admin: boolean;
  avatar_url?: string | null;
  national_id?: string | null;
  postal_code?: string | null;
  address_line?: string | null;
};

/** `PATCH /auth/me` — در صورت فعال بودن در بک‌اند */
export type CustomerProfileUpdateBody = {
  full_name?: string;
  email?: string | null;
  national_id?: string | null;
  postal_code?: string | null;
  address_line?: string | null;
};

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalId: string;
  postalCode: string;
  addressLine: string;
  avatarUrl: string | null;
};
