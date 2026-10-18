import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const StyledLabel = ({
  className,
  ...props
}: ComponentProps<"label">) => (
  <label
    className={cn(
      "mb-4 block text-[1.4rem] font-semibold text-text opacity-75",
      className
    )}
    {...props}
  />
);
