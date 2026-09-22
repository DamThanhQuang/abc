import { type NextRequest, NextResponse } from "next/server";
import { handlers } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const { GET } = handlers;

const LOGIN_MAX = 10;
const LOGIN_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  let result;
  try {
    result = await checkRateLimit(`auth:${ip}`, LOGIN_MAX, LOGIN_WINDOW_MS);
  } catch (error) {
    console.error("auth rate limit:", error);
    return NextResponse.json(
      { error: "Không thể xác minh giới hạn đăng nhập. Vui lòng thử lại sau." },
      { status: 503 },
    );
  }

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
