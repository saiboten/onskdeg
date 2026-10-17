import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const StyledActionButtons = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn("flex shrink-0 items-center justify-start", className)}
    {...props}
  />
);
