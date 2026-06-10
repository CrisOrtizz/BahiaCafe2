import type { AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-background hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(200,151,74,0.5)]",
  secondary:
    "border border-gold/45 text-gold hover:bg-gold hover:text-background",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
