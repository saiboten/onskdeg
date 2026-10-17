import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const Form = ({ className, ...props }: ComponentProps<"form">) => (
  <form className={cn("mb-10 text-left", className)} {...props} />
);
