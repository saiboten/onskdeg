import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const StyledBigHeader = ({
  className,
  ...props
}: ComponentProps<"h1">) => (
  <h1 className={cn("text-[3rem] font-medium", className)} {...props} />
);

export const StyledSubHeader = ({
  className,
  ...props
}: ComponentProps<"h2">) => (
  <h2 className={cn("text-[2rem] font-light", className)} {...props} />
);
