"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
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
