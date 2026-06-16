"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import type {
  AdminSignInModel,
  JWT,
  UserSession,
} from "@/app/(auth)/_types/auth.types";
import { createData } from "@/app/core/http-service/http-service";
import { extractActionErrorMessage } from "@/app/_actions/extract-action-error";
import { decryptSession, encryptSession } from "@/app/utils/session";

type DrshoesLoginResponse = {
  access_token: string;
  token_type: string;
};

async function setAdminSessionCookie(accessToken: string, username: string) {
  const decoded = jwtDecode<JWT>(accessToken);
  const expMs = (decoded.exp ?? Math.floor(Date.now() / 1000) + 86400) * 1000;

  const session: UserSession = {
    userName: decoded.userName ?? username,
    fullName: decoded.fullName ?? username,
    exp: expMs,
    accesstoken: accessToken,
    sessionId: "drshoes-admin",
    sessionExpiry: expMs,
    userId: decoded.userId != null ? String(decoded.userId) : decoded.sub,
    roles: ["admin"],
    permissions: ["admin.manage"],
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

export async function adminSignInAction(model: AdminSignInModel) {
  try {
    const response = await createData<AdminSignInModel, DrshoesLoginResponse>(
      "/auth/login",
      model
    );

    if (!response.access_token) {
      return { success: false as const, error: "خطا در ورود" };
    }

    await setAdminSessionCookie(response.access_token, model.username);
    return { success: true as const };
  } catch (err: unknown) {
    return {
      success: false as const,
      error: extractActionErrorMessage(err, "خطا در ورود"),
    };
  }
}

export async function adminSignOutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("erp-session");
    return { success: true as const };
  } catch {
    return { success: true as const };
  }
}

export async function getAdminSessionAction() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("erp-session")?.value;
    if (!raw) {
      return { success: false as const, session: null };
    }
    const session = await decryptSession(raw);
    if (session.exp < Date.now()) {
      cookieStore.delete("erp-session");
      return { success: false as const, session: null };
    }
    return { success: true as const, session };
  } catch {
    return { success: false as const, session: null };
  }
}
