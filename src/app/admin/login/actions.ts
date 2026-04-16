"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const expected = process.env.ADMIN_TOKEN;
  const next = String(formData.get("next") ?? "/admin/conversations");

  if (!expected || token !== expected) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next);
}

export async function adminLogout() {
  const store = await cookies();
  store.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}

