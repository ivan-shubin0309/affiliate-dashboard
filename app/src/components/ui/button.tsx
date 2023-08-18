import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary",
        "primary-outline":
          "border border-input hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary",
        "secondary-outline":
          "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground text-primary",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4 w-36 min-w-max",
        sm: "h-9 px-3 rounded-md min-w-max",
        lg: "h-11 px-8 rounded-md w-48 min-w-max",
        rec: "p-3.5 h-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // TODO:TW need to implement
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, disabled, variant, size, isLoading, children, ...props },
    ref
  ) => {
    //TODO: isLoading
    return (
      <>
        <button
          type="button"
          className={cn(buttonVariants({ variant, size, className }))}
          disabled={disabled || isLoading}
          ref={ref}
          {...props}
        >
          {isLoading ? (
            <div className="relative">
              <Loader2 className="absolute left-0 right-0 top-1 mx-auto my-0	h-4 w-4 animate-spin" />
              <span className="flex opacity-0	">{children}</span>
            </div>
          ) : (
            children
          )}
        </button>
      </>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
