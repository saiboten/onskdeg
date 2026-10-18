import { ComponentProps } from "react";
import { cn } from "../../util/cn";

/** An input with its submit button (or spinner) on the same line. */
export const StyledLabelInputPair = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn("flex items-center gap-8 [&>button]:h-48", className)}
    {...props}
  />
);
