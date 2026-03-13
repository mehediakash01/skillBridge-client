import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "https://skill-bridge-server-tau.vercel.app";

function getBackendBaseUrl() {
  return (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/+$/, "");
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const forwardedOrigin = request.headers.get("origin") ?? new URL(request.url).origin;
  const upstream = await fetch(`${getBackendBaseUrl()}/api/auth/request-password-reset`, {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
      cookie: request.headers.get("cookie") ?? "",
      origin: forwardedOrigin,
      referer: request.headers.get("referer") ?? `${forwardedOrigin}/`,
      "user-agent": request.headers.get("user-agent") ?? "nextjs-proxy",
    },
    body: payload,
    cache: "no-store",
  });

  const responseBody = await upstream.text();
  const response = new NextResponse(responseBody, {
    status: upstream.status,
  });

  const contentType = upstream.headers.get("content-type");
  const setCookie = upstream.headers.get("set-cookie");

  if (contentType) {
    response.headers.set("content-type", contentType);
  }

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}