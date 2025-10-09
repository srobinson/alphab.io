import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const statusPillVariants = cva("status-pill", {
  variants: {
    variant: {
      red: "status-pill-red",
      blue: "status-pill-blue",
      green: "status-pill-green",
      yellow: "status-pill-yellow",
      purple: "status-pill-purple",
      cyan: "status-pill-cyan",
    },
    glow: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "red",
      glow: true,
      className: "glow-red",
    },
    {
      variant: "blue",
      glow: true,
      className: "glow-blue",
    },
    {
      variant: "green",
      glow: true,
      className: "glow-green",
    },
    {
      variant: "yellow",
      glow: true,
      className: "glow-yellow",
    },
    {
      variant: "purple",
      glow: true,
      className: "glow-purple",
    },
    {
      variant: "cyan",
      glow: true,
      className: "glow-cyan",
    },
  ],
  defaultVariants: {
    variant: "blue",
    glow: false,
  },
});

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusPillVariants> {}

const StatusPill = React.forwardRef<HTMLDivElement, StatusPillProps>(
  ({ className, variant, glow, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(statusPillVariants({ variant, glow }), className)} {...props} />
    );
  }
);
StatusPill.displayName = "StatusPill";

/**
 * Usage examples:
 * ```tsx
 * <StatusPill variant="red">LIVE NOW</StatusPill>
 * <StatusPill variant="blue" glow>ACTIVE</StatusPill>
 * <StatusPill variant="green">WIP</StatusPill>
 * ```
 */

export { StatusPill };
