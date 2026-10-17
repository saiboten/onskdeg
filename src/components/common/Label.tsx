import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const StyledLabel = ({
  className,
  ...props
}: ComponentProps<"label">) => (
  <label className={cn("text-[1.6rem] text-text", className)} {...props} />
);
