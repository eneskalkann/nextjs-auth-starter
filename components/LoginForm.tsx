"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const response = await signIn("credentials", {
        ...Object.fromEntries(formData),
        redirect: false,
      });
      setLoading(false);
      if (response?.error) {
        if (reason === "not_admin") {
          setError("Bu sayfaya erişmek için admin olmalısınız.");
        } else {
          setError("Invalid credentials");
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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
