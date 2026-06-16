import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { UserSession } from "@/app/(auth)/_types/auth.types";

const COOKIE_NAME = "erp-session";

function getSecret(): string {
  return process.env.SESSION_SECRET || "drshoes-dev-session-secret";
}

export async function encryptSession(session: UserSession): Promise<string> {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export async function decryptSession(token: string): Promise<UserSession> {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) {
    throw new Error("Invalid session token");
  }
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Invalid session signature");
  }
  return JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8")
  ) as UserSession;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return await decryptSession(raw);
  } catch {
    return null;
  }
}
