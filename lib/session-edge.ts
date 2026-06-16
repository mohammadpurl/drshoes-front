import type { UserSession } from "@/app/(auth)/_types/auth.types";

function getSecret(): string {
  return process.env.SESSION_SECRET || "drshoes-dev-session-secret";
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToBytes(value: string): Uint8Array {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function signPayload(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return base64UrlEncode(new Uint8Array(signature));
}

/** نسخه Edge برای middleware — همان الگوریتم `app/utils/session.ts` */
export async function decryptSessionEdge(token: string): Promise<UserSession> {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) {
    throw new Error("Invalid session token");
  }

  const expected = await signPayload(payload);
  if (sig !== expected) {
    throw new Error("Invalid session signature");
  }

  const json = new TextDecoder().decode(base64UrlDecodeToBytes(payload));
  return JSON.parse(json) as UserSession;
}
