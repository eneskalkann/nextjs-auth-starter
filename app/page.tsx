"use client";

import { Suspense } from "react";
import { useLoading } from "./providers";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const { setLoading } = useLoading();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Suspense fallback={null}>
          <LoginForm setLoading={setLoading} />
        </Suspense>
      </div>
    </div>
  );
}
