"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import type { JWT, UserSession } from "@/app/(auth)/_types/auth.types";
import {
  createDataWithCartToken,
  readDataWithAuth,
} from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import { encryptSession } from "@/app/utils/session";
import type {
  AuthTokenResponse,
  CustomerLoginBody,
  CustomerMeRead,
  CustomerRegisterBody,
} from "@/types/auth.api";
import type { ActionResult, ActionVoidResult } from "@/types/action.types";

async function setCustomerSessionCookie(
  accessToken: string,
  username: string
) {
  const decoded = jwtDecode<JWT>(accessToken);
  const expMs = (decoded.exp ?? Math.floor(Date.now() / 1000) + 86400) * 1000;

  const rolesFromJwt = Array.isArray(decoded.roles)
    ? decoded.roles
    : typeof decoded.role === "string"
      ? [decoded.role]
      : Array.isArray(decoded.role)
        ? decoded.role
        : ["customer"];

  const session: UserSession = {
    userName: decoded.userName ?? username,
    fullName: decoded.fullName ?? username,
    exp: expMs,
    accesstoken: accessToken,
    sessionId: "drshoes-customer",
    sessionExpiry: expMs,
    userId:
      decoded.userId != null
        ? String(decoded.userId)
        : decoded.sub
          ? String(decoded.sub)
          : undefined,
    roles: rolesFromJwt,
    permissions: Array.isArray(decoded.permissions) ? decoded.permissions : [],
  };

  const encrypted = await encryptSession(session);
  const cookieStore = await cookies();
  cookieStore.set("erp-session", encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

/** `POST /auth/login` */
export async function customerSignInAction(
  model: CustomerLoginBody,
  cartToken?: string
): Promise<ActionVoidResult> {
  try {
    const response = await createDataWithCartToken<
      CustomerLoginBody,
      AuthTokenResponse
    >(
      "/auth/login",
      {
        username: model.username.trim(),
        password: model.password,
      },
      cartToken
    );

    if (!response.access_token) {
      return { success: false, error: "خطا در ورود" };
    }

    await setCustomerSessionCookie(
      response.access_token,
      model.username.trim()
    );
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "نام کاربری یا رمز عبور اشتباه است"),
    };
  }
}

/** `POST /auth/register` */
export async function customerRegisterAction(
  model: CustomerRegisterBody,
  cartToken?: string
): Promise<ActionVoidResult> {
  const phone = model.phone.trim();
  if (!phone) {
    return { success: false, error: "شماره موبایل الزامی است" };
  }

  try {
    const response = await createDataWithCartToken<
      CustomerRegisterBody,
      AuthTokenResponse
    >("/auth/register", {
      username: model.username.trim(),
      password: model.password,
      fullName: model.fullName.trim(),
      phone,
    }, cartToken);

    if (!response.access_token) {
      return { success: false, error: "خطا در ثبت‌نام" };
    }

    await setCustomerSessionCookie(
      response.access_token,
      model.username.trim()
    );
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در ثبت‌نام"),
    };
  }
}

/** `GET /auth/me` */
export async function getCustomerMeAction(): Promise<
  ActionResult<CustomerMeRead>
> {
  try {
    const data = await readDataWithAuth<CustomerMeRead>("/auth/me");
    return { success: true, data };
  } catch (err: unknown) {
    return {
      success: false,
      error: extractActionErrorMessage(err, "خطا در دریافت پروفایل"),
    };
  }
}

export async function customerSignOutAction(): Promise<ActionVoidResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("erp-session");
    return { success: true };
  } catch {
    return { success: true };
  }
}
