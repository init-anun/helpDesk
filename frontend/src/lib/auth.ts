// src/lib/auth.ts

import { apiFetch } from "./api";
import { LoginResponse } from "@/types/api";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}