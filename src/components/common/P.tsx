import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const P = ({ className, ...props }: ComponentProps<"p">) => (
  <p className={cn("mb-10", className)} {...props} />
);
