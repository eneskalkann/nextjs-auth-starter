"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import React, { createContext, useContext, useState } from "react";
import { NewOrderProvider } from "../lib/context/NewOrderContext";

// Global Loading Context
const LoadingContext = createContext<{
  loading: boolean;
  setLoading: (v: boolean) => void;
}>({ loading: false, setLoading: () => {} });

export function useLoading() {
  return useContext(LoadingContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <NewOrderProvider initialCount={0}>
        <Toaster position="top-right" richColors />
        <SessionProvider>{children}</SessionProvider>
      </NewOrderProvider>
    </LoadingContext.Provider>
  );
}
