"use client";

import { Loader2, UserCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button, LinkButton } from "@/components/ui/button";
import { useAuthState } from "@/hooks/use-auth-state";

type AuthStatusLinkProps = {
  className?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function AuthStatusLink({ className, children, variant = "secondary" }: AuthStatusLinkProps) {
  const { user, isAuthLoading } = useAuthState();

  if (isAuthLoading) {
    return (
      <Button
        className={className}
        disabled
        icon={<Loader2 className="h-4 w-4 animate-spin" />}
        variant={variant}
      >
        Loading
      </Button>
    );
  }

  if (user) {
    return (
      <LinkButton
        className={className}
        href="/login"
        icon={<UserCircle className="h-4 w-4" />}
        variant={variant}
      >
        {user.displayName || user.email || "Profile"}
      </LinkButton>
    );
  }

  return (
    <LinkButton className={className} href="/login" variant={variant}>
      {children}
    </LinkButton>
  );
}
