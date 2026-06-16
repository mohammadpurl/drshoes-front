import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { decryptSessionEdge } from "@/lib/session-edge";

const ADMIN_LOGIN = "/admin/login";

function isAdminArea(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminLoginPath(pathname: string): boolean {
  return pathname === ADMIN_LOGIN;
}

async function readSession(
  request: NextRequest
): Promise<Awaited<ReturnType<typeof decryptSessionEdge>> | null> {
  const raw = request.cookies.get("erp-session")?.value;
  if (!raw) return null;

  try {
    const session = await decryptSessionEdge(raw);
    if (session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminArea(pathname)) {
    return NextResponse.next();
  }

  const session = await readSession(request);
  const admin = isAdminSession(session);

  if (isAdminLoginPath(pathname)) {
    if (admin) {
      return NextResponse.redirect(new URL("/admin/reports", request.url));
    }
    return NextResponse.next();
  }

  if (!admin) {
    const destination = session ? "/" : ADMIN_LOGIN;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

