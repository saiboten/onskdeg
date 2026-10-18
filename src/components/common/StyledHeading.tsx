import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const StyledBigHeader = ({
  className,
  ...props
}: ComponentProps<"h1">) => (
  <h1
    className={cn(
      "mb-16 text-[2.8rem] leading-[1.25] font-medium wrap-break-word",
      className
    )}
    {...props}
  />
);

export const StyledSubHeader = ({
  className,
  ...props
}: ComponentProps<"h2">) => (
  <h2
    className={cn("mb-8 text-[2rem] leading-[1.3] font-normal", className)}
    {...props}
  />
);
