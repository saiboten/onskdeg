import { ComponentProps } from "react";
import { cn } from "../../util/cn";

type ButtonProps = ComponentProps<"button">;

export const BorderButton = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      "mb-16 min-h-48 max-w-300 cursor-pointer rounded-[8px] border-2 border-solid border-secondary bg-transparent px-14 py-7 text-[16px] text-text outline-none transition-all duration-200 ease-[ease]",
      "hover:-translate-y-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.2)]",
      className
    )}
    {...props}
  />
);

export const ButtonNavigation = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      "flex h-40 cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-[3px] border-0 bg-primary px-18 text-center align-middle font-sans text-[13px] leading-40 font-semibold text-text no-underline",
      className
    )}
    {...props}
  />
);

export const Button = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      "inline-block cursor-pointer overflow-hidden whitespace-nowrap rounded-[3px] border-0 bg-secondary px-18 text-center font-sans text-[13px] leading-40 font-semibold text-text no-underline",
      className
    )}
    {...props}
  />
);

export const DangerButton = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      "mb-16 min-h-48 max-w-300 cursor-pointer rounded-[8px] border-2 border-solid border-negative bg-negative px-14 py-7 font-sans text-[16px] font-semibold text-white outline-none transition-all duration-200 ease-[ease]",
      "hover:bg-transparent hover:text-negative active:scale-[0.98]",
      className
    )}
    {...props}
  />
);
