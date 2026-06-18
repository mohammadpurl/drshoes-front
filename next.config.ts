import type { NextConfig } from "next";

function supabaseStoragePatterns() {
  return [
    {
      protocol: "https" as const,
      hostname: "**.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ];
}

function mediaRemotePatterns() {
  const host = process.env.NEXT_PUBLIC_MEDIA_CDN_HOST?.trim();
  if (!host) return [];

  const protocol =
    process.env.NEXT_PUBLIC_MEDIA_CDN_URL?.startsWith("http://")
      ? "http"
      : "https";

  return [
    {
      protocol: protocol as "http" | "https",
      hostname: host,
      pathname: "/**",
    },
  ];
}

function apiRemotePatterns() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) return [];

  try {
    const parsed = new URL(apiUrl);
    const protocol = parsed.protocol.replace(":", "") as "http" | "https";
    const port = parsed.port || undefined;

    const hostnames =
      parsed.hostname === "localhost"
        ? ["localhost", "127.0.0.1"]
        : [parsed.hostname];

    return hostnames.flatMap((hostname) => [
      {
        protocol,
        hostname,
        port,
        pathname: "/static/**",
      },
      {
        protocol,
        hostname,
        port,
        pathname: "/api/v1/media/**",
      },
    ]);
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...supabaseStoragePatterns(),
      ...mediaRemotePatterns(),
      ...apiRemotePatterns(),
    ],
  },
};

export default nextConfig;
