type ClassValue = string | false | null | undefined;

/** Joins class names, skipping falsy values: cn("a", isActive && "b"). */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
