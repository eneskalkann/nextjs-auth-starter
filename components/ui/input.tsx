"use client";
import * as React from "react";

import { cn } from "@/lib/cn";
import { EyeIcon, EyeOff } from "lucide-react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };
    return (
      <div className="relative">
        <input
          type={type == "password" && showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full text-gray-900 rounded-md border-[1.5px] border-gray-400 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {type == "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-4 flex items-center text-black"
          >
            {showPassword ? <EyeIcon size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
