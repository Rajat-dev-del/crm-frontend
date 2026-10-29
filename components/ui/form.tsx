import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Shared look for text inputs, selects and textareas. */
export const controlClass =
  "w-full rounded-lg border border-line bg-surface px-3.5 text-label font-normal text-heading placeholder:text-muted transition-colors focus:border-primary-400 focus:outline-none focus:ring-3 focus:ring-primary-500/15 disabled:opacity-60 aria-invalid:border-danger-500";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + error message. Pass the same id to the control and `htmlFor`. */
export function Field({ label, htmlFor, required, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-label font-semibold text-heading">
        {label}
        {required && <span className="ml-0.5 text-danger-500" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-caption text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(controlClass, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, "min-h-28 resize-y py-2.5", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(controlClass, "h-11 appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

export function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return <input type="checkbox" className={cn("size-4 cursor-pointer rounded accent-primary-500", className)} {...props} />;
}
