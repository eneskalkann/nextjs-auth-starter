import React from "react";

export default function Spinner({
  className = "h-6 w-6 text-blue-600",
  overlay = false,
  children,
}: {
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <svg
          className={`animate-spin ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Yükleniyor..."
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        {children}
      </div>
    );
  }
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Yükleniyor..."
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  );
}
