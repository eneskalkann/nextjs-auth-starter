"use client";

// ... existing imports ...

interface RegisterFormProps {
  enabledProviders: {
    google: boolean;
    github: boolean;
  };
}

export function RegisterForm({ enabledProviders }: RegisterFormProps) {
  // ... existing state and handleSubmit ...

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      {(enabledProviders.google || enabledProviders.github) && (
        <div className="flex flex-col space-y-4">
          {enabledProviders.google && (
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {/* ... Google button content ... */}
            </button>
          )}
          {enabledProviders.github && (
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {/* ... GitHub button content ... */}
            </button>
          )}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>
      )}
      {/* ... rest of the form ... */}
    </div>
  );
} 