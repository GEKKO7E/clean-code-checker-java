import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-ink-950 hover:bg-cyan-100 shadow-glow border border-white/80",
  secondary:
    "border border-white/12 bg-white/[0.06] text-white hover:border-cyan-300/40 hover:bg-white/[0.09]",
  ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: ReactNode;
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
};

export function LinkButton({
  className,
  variant = "primary",
  icon,
  children,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
        variants[variant],
        className,
      )}
      href={href}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
