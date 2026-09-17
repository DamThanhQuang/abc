import { type NextRequest, NextResponse } from "next/server";
import { handlers } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export const { GET } = handlers;

const LOGIN_MAX = 10;
const LOGIN_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const result = checkRateLimit(`auth:${ip}`, LOGIN_MAX, LOGIN_WINDOW_MS);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) },
      },
    );
  }

  return handlers.POST(request);
}
