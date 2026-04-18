import type { AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "border border-gray-300 text-black hover:border-black",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
