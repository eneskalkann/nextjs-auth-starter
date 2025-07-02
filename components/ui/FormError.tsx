import React from "react";

export default function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div className="text-red-500 text-sm text-center my-2">{message}</div>;
}
