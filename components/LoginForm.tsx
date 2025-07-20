"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm({
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [error, setError] = useState<string | null>(
    reason === "not_admin" ? "Bu sayfaya erişmek için admin olmalısınız." : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setLoading(true);
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      setLoading(false);
      if (response?.error) {
        if (reason === "not_admin") {
          setError("Bu sayfaya erişmek için admin olmalısınız.");
        } else {
          setError("Eksik yada hatalı giriş!");
        }
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setError("An error occurred during login");
      toast.error("An error occurred during login");
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md shadow-sm space-y-2">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <div className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <div className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </div>
    </form>
  );
}
