import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const inputStyle =
  "h-48 w-full min-w-0 flex-1 rounded-[10px] border-2 border-solid border-transparent bg-primary-light px-16 text-[1.6rem] text-black outline-none transition-colors placeholder:text-[1.6rem] placeholder:text-[#6b6480] focus:border-secondary";

export const StyledInput = ({
  className,
  ...props
}: ComponentProps<"input">) => (
  <input className={cn(inputStyle, className)} {...props} />
);
