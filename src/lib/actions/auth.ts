"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_MAX = 10;
const LOGIN_WINDOW_MS = 60_000;

export async function login(formData: FormData) {
  try {
    const requestHeaders = await headers();
    const ip = getClientIp(requestHeaders);
    const result = await checkRateLimit(`auth:${ip}`, LOGIN_MAX, LOGIN_WINDOW_MS);
    if (!result.allowed) {
      return { error: "Quá nhiều lần đăng nhập. Vui lòng thử lại sau." };
    }
  } catch (error) {
    console.error("login rate limit:", error);
    return { error: "Không thể xác minh giới hạn đăng nhập. Vui lòng thử lại sau." };
  }

  try {
    await signIn("credentials", {
      email:       formData.get("email"),
      password:    formData.get("password"),
      redirectTo:  "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Email hoặc mật khẩu không đúng." };
        default:
          return { error: "Đã xảy ra lỗi. Vui lòng thử lại." };
      }
    }
    throw err; // re-throw redirects
  }
}

export async function logout() {
  await signOut({ redirectTo: "/dang-nhap" });
}
