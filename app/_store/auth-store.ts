import { create } from "zustand";
import { UserSession } from "@/app/(auth)/_types/auth.types";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface SessionState {
  session: UserSession | null;
  status: AuthStatus;
  clearSession: () => void;
  updateSession: () => Promise<void>;
  error: string | null;
}

let sessionRequest: Promise<void> | null = null;

async function fetchSessionFromAPI(): Promise<{
  session: UserSession | null;
  status: AuthStatus;
}> {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    });

    if (!response.ok) {
      return { session: null, status: "unauthenticated" };
    }

    const data = await response.json();
    if (data && Object.keys(data).length > 0) {
      return { session: data, status: "authenticated" };
    }

    return { session: null, status: "unauthenticated" };
  } catch {
    return { session: null, status: "unauthenticated" };
  }
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: "loading",
  error: null,
  clearSession: () => {
    set({
      session: null,
      status: "unauthenticated",
    });
  },
  updateSession: async () => {
    if (!sessionRequest) {
      sessionRequest = fetchSessionFromAPI()
        .then(({ session, status }) => {
          set({ session, status });
        })
        .finally(() => {
          sessionRequest = null;
        });
    }
    await sessionRequest;
  },
}));
