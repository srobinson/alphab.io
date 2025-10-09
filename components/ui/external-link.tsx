"use client";

import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface ExternalLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children, className = "", ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 hover:text-primary transition-colors ${className}`}
      {...props}
    >
      {children}
      <ExternalLinkIcon className="h-3 w-3 ml-0.5 flex-shrink-0" />
    </a>
  );
}
