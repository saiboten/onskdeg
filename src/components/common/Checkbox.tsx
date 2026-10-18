import { ComponentProps, ReactNode } from "react";
import { cn } from "../../util/cn";

const checkbox =
  "relative h-24 w-24 shrink-0 cursor-pointer appearance-none rounded-[4px] border-2 border-solid border-secondary bg-primary-dark transition-all duration-200 ease-[ease] checked:border-secondary checked:bg-secondary checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-[1.8rem] checked:after:font-bold checked:after:text-text checked:after:content-['✓'] hover:border-primary-light hover:shadow-[0_0_0_2px_var(--color-secondary-dark)]";

export const Checkbox = ({
  label,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode }) => (
  <label
    className={cn(
      "flex cursor-pointer items-center gap-12 text-[1.6rem] text-text select-none",
      className
    )}
  >
    <input className={checkbox} type="checkbox" {...props} />
    <span>{label}</span>
  </label>
);
