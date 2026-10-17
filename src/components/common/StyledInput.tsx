import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const StyledInput = ({
  className,
  ...props
}: ComponentProps<"input">) => (
  <input
    className={cn(
      "h-48 w-full flex-1 rounded-[5rem] border-none bg-primary-light p-30 pl-15 text-[1.6rem] placeholder:text-[1.6rem]",
      className
    )}
    {...props}
  />
);
