import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cyberCardVariants = cva("relative overflow-hidden cyber-card", {
  variants: {
    variant: {
      default: "",
      red: "",
      blue: "",
      green: "",
      yellow: "",
      purple: "",
      cyan: "",
    },
    hover: {
      // true: "cyber-card-hover",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    hover: true,
  },
});

export interface CyberCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cyberCardVariants> {
  scanLine?: boolean;
}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, variant, hover, scanLine, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cyberCardVariants({ variant, hover }), className)} {...props}>
        {variant !== "default" && (
          <div className={cn(`absolute inset-0 cyber-card-gradient-${variant}`)} />
        )}
        <div className="relative z-10">{children}</div>
        {scanLine && <div className="absolute inset-0 z-20 _scan-line-hover pointer-events-none" />}
      </div>
    );
  }
);
CyberCard.displayName = "CyberCard";

const CyberCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative p-6", className)} {...props} />
  )
);
CyberCardContent.displayName = "CyberCardContent";

export { CyberCard, CyberCardContent };
