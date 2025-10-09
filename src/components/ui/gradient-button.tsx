import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold tracking-wider ring-offset-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        red: "btn-gradient-red",
        "yellow-red": "btn-gradient-yellow-red",
        blue: "btn-gradient-blue",
        green: "btn-gradient-green",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "yellow-red",
      size: "default",
    },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

/**
 * Usage examples:
 * ```tsx
 * <GradientButton variant="yellow-red">JOIN NOW</GradientButton>
 * <GradientButton variant="red" size="lg">EXPLORE SERVICES</GradientButton>
 * <GradientButton variant="blue" disabled>LOADING...</GradientButton>
 * ```
 */

export { GradientButton };
