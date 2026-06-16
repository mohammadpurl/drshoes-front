# فاز ۱ — فروشگاه قابل خرید (برنامه روزبه‌روز)

**هدف:** سبد واقعی API → ورود مشتری → آدرس → checkout  
**فرض:** بک‌اند `/cart`, `/auth`, `/addresses`, `/orders` فعال است  
**با Cursor:** ~۵–۸ روز کاری (۴–۶ ساعت/روز)

---

## روز ۱ — سبد API (پایه)

- [x] `types/cart.api.ts` — تایپ‌های سبد
- [x] `lib/cart-mapper.ts` — نگاشت پاسخ API → `CartItem`
- [x] `lib/cart-token.ts` — کلید `X-Cart-Token`
- [x] HTTP helpers سبد در `core/http-service`
- [x] `app/_actions/cart-actions.ts`
- [x] `hooks/use-cart-actions.ts` — همگام‌سازی store با API
- [x] به‌روزرسانی `cart-store` + `CartDrawer` + افزودن به سبد در کارت/جزئیات/quick-view
- [x] `components/cart/cart-sync.tsx` — بارگذاری اولیه سبد

**تست دستی:** افزودن کفش → باز کردن سبد → تغییر تعداد → حذف → رفرش صفحه (سبد بماند)

---

## روز ۲ — پایداری سبد مهمان

- [ ] merge سبد مهمان پس از لاگین (اگر بک‌اند پشتیبانی کند)
- [ ] حالت loading/error در `CartDrawer`
- [ ] optimistic UI + rollback در خطا
- [ ] پاکسازی `localStorage` قدیمی در صورت تعارض

**تست:** دو تب مرورگر، توکن جدا، مهمان + لاگین

---

## روز ۳ — احراز هویت مشتری

- [ ] `types/auth.api.ts` هم‌راستا با بک‌اند (`access_token`, `/auth/me`)
- [ ] بازنویسی `auth-actions.ts` (حذف وابستگی ERP)
- [ ] صفحات `/login` و `/register`
- [ ] کوکی سشن مشتری (جدا از ادمین یا یکپارچه با نقش)

**تست:** ثبت‌نام → ورود → `/auth/me` → خروج

---

## روز ۴ — پروفایل و `/auth/me`

- [ ] `app/profile/page.tsx` واقعی (نام، ایمیل)
- [ ] گارد: ریدایرکت مهمان به login
- [ ] لینک ورود در header و bottom-nav

---

## روز ۵ — آدرس‌ها

- [ ] `types/address.api.ts` + `address-actions.ts`
- [ ] `app/profile/addresses/page.tsx` — لیست + فرم CRUD
- [ ] انتخاب آدرس پیش‌فرض

**تست:** افزودن / ویرایش / حذف آدرس

---

## روز ۶ — Checkout

- [ ] `app/checkout/page.tsx`
- [ ] انتخاب آدرس + یادداشت
- [ ] `POST /orders/checkout`
- [ ] `app/checkout/success/page.tsx`

**تست:** خرید end-to-end بدون درگاه (ثبت سفارش)

---

## روز ۷ — سفارش‌های من (شروع فاز ۲ زودهنگام)

- [ ] `GET /orders` در پروفایل
- [ ] جزئیات یک سفارش
- [ ] خالی کردن سبد پس از checkout موفق

---

## روز ۸ — تست و رفع باگ

- [ ] سناریوی کامل: مرور → افزودن → checkout → سفارش
- [ ] موبایل + دسکتاپ
- [ ] حذف کدهای mock سبد محلی (اگر باقی مانده)

---

## بعد از فاز ۱

فاز ۲: نظرات، ادمین سفارش، ویدئو محصول  
فاز ۳: درگاه پرداخت، تست e2e، CI
