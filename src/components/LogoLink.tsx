"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

const sizes = {
  sm: { icon: "h-8 w-8 text-xs", text: "text-base" },
  md: { icon: "h-9 w-9 text-sm", text: "text-xl" },
  lg: { icon: "h-10 w-10 text-sm", text: "text-2xl" },
};

export default function LogoLink({
  className = "flex items-center gap-2",
  size = "md",
  showText = true,
  textClassName,
}: {
  className?: string;
  size?: keyof typeof sizes;
  showText?: boolean;
  textClassName?: string;
}) {
  const { user, isLoading } = useAuth();
  const href = !isLoading && user ? "/explore" : "/";
  const s = sizes[size];

  return (
    <Link href={href} className={className}>
      <span
        className={`flex items-center justify-center rounded-lg bg-primary font-bold text-white ${s.icon}`}
      >
        SN
      </span>
      {showText && (
        <span
          className={`font-bold tracking-tight text-foreground ${s.text} ${textClassName ?? ""}`}
        >
          Stay N Go
        </span>
      )}
    </Link>
  );
}
