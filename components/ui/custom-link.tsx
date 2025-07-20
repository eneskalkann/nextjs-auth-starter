import * as React from "react";
import Link, { LinkProps } from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

export interface CustomLinkProps
  extends LinkProps,
    VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
}

const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
CustomLink.displayName = "CustomLink";

export { CustomLink };
