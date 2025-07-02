"use client";
import * as React from "react";

import { cn } from "@/lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, showCharacterCount = false, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState<number>(0);

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setCharCount(event.target.value.length);
    };

    return (
      <div className="relative">
        <textarea
          maxLength={maxLength}
          className={cn(
            "flex min-h-[100px] text-gray-900 w-full resize-none outline-none rounded-md border-[1.5px] border-gray-400 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onChange={handleInputChange}
          {...props}
        />
        {showCharacterCount && maxLength && (
          <span className="absolute bottom-2 right-3 text-xs text-gray-700">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
