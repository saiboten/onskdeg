import { ComponentProps } from "react";
import { cn } from "../../util/cn";

type ButtonProps = ComponentProps<"button">;

const base =
  "inline-flex cursor-pointer select-none items-center justify-center gap-8 whitespace-nowrap rounded-[8px] font-sans no-underline transition-all duration-200 ease-[ease] disabled:pointer-events-none disabled:opacity-50";

// Exported so links can look like buttons.
export const borderButton = cn(
  base,
  "min-h-40 border-2 border-solid border-secondary bg-transparent px-16 py-6 text-[1.5rem] text-text",
  "hover:-translate-y-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
);

export const filledButton = cn(
  base,
  "h-40 border-0 bg-secondary px-16 text-[1.4rem] font-semibold text-text hover:brightness-110"
);

export const BorderButton = ({ className, ...props }: ButtonProps) => (
  <button className={cn(borderButton, className)} {...props} />
);

export const Button = ({ className, ...props }: ButtonProps) => (
  <button className={cn(filledButton, className)} {...props} />
);

/** Square icon-only button; pass an aria-label. */
export const IconButton = ({ className, ...props }: ButtonProps) => (
  <button
    type="button"
    className={cn(
      "flex h-36 w-36 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-none bg-transparent p-0 text-text transition-transform duration-200 ease-[ease] hover:scale-110",
      className
    )}
    {...props}
  />
);

export const DangerButton = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      base,
      "min-h-40 border-2 border-solid border-negative bg-negative px-16 py-6 text-[1.5rem] font-semibold text-white outline-none",
      "hover:bg-transparent hover:text-negative active:scale-[0.98]",
      className
    )}
    {...props}
  />
);
