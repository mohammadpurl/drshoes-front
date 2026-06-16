"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeSetting = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme?: ThemeSetting;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSetting>>;
  resolvedTheme?: ResolvedTheme;
  themes: ThemeSetting[];
  systemTheme?: ResolvedTheme;
};

const STORAGE_KEY = "drshoes-theme";

const ThemeContext = createContext<ThemeContextValue>({
  themes: ["light", "dark", "system"],
  setTheme: () => {},
});

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: ThemeSetting): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

function readStoredTheme(): ThemeSetting {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return "system";
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSetting>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    const resolved = resolveTheme(stored);
    setThemeState(stored);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setThemeState((current) => {
        if (current !== "system") return current;
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved);
        return current;
      });
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mounted]);

  const setTheme = useCallback<React.Dispatch<React.SetStateAction<ThemeSetting>>>(
    (value) => {
      setThemeState(value);
    },
    []
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: mounted ? theme : undefined,
      setTheme,
      resolvedTheme: mounted ? resolvedTheme : undefined,
      themes: ["light", "dark", "system"],
      systemTheme: mounted ? getSystemTheme() : undefined,
    }),
    [mounted, theme, setTheme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
