import { ComponentProps, ReactNode } from "react";
import { cn } from "../../util/cn";

/** A toggle switch (a styled checkbox) with a label and optional hint. */
export const Checkbox = ({
  label,
  description,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  description?: ReactNode;
}) => (
  <label
    className={cn(
      "flex cursor-pointer items-center justify-between gap-16 text-[1.6rem] text-text select-none",
      className,
    )}
  >
    <span className="min-w-0">
      <span className="block">{label}</span>
      {description && (
        <span className="block text-[1.3rem] opacity-70">{description}</span>
      )}
    </span>
    <span className="relative inline-flex shrink-0">
      <input className="peer sr-only" type="checkbox" {...props} />
      <span className="h-28 w-48 rounded-full bg-primary-dark shadow-[inset_0_0_0_2px_var(--color-secondary-dark)] transition-colors duration-200 peer-checked:bg-secondary peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-secondary" />
      <span className="pointer-events-none absolute top-4 left-4 h-20 w-20 rounded-full bg-text opacity-60 transition-all duration-200 peer-checked:translate-x-20 peer-checked:bg-white peer-checked:opacity-100" />
    </span>
  </label>
);
