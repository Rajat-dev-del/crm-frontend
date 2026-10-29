import { cn } from "@/lib/utils/cn";

/** Round icon button look; exported for triggers that render their own <button> (e.g. Dropdown). */
export const iconButtonClass =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-heading transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/15 [&_svg]:size-5";

type IconButtonProps = React.ComponentProps<"button"> & {
  /** Required: icon-only buttons need an accessible name. */
  "aria-label": string;
};

export function IconButton({ className, type = "button", ...props }: IconButtonProps) {
  return <button type={type} className={cn(iconButtonClass, className)} {...props} />;
}
