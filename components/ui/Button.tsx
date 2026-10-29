import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleOptions = { variant?: ButtonVariant; size?: ButtonSize; className?: string };

type ButtonProps = React.ComponentProps<"button"> & ButtonStyleOptions;

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white shadow-sm hover:bg-primary-600",
  secondary: "border border-line bg-surface text-heading hover:bg-surface-muted",
  ghost: "text-body hover:bg-surface-muted hover:text-heading",
  danger: "bg-danger-500 text-white shadow-sm hover:bg-danger-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-caption [&_svg]:size-3.5",
  md: "h-10 px-4 text-label [&_svg]:size-4",
  lg: "h-12 px-5 text-label [&_svg]:size-5",
};

/** Button look as a class string, for links styled as buttons: <Link className={buttonClass()} />. */
export function buttonClass({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}
