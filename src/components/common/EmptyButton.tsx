import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const EmptyButton = ({
  className,
  ...props
}: ComponentProps<"button">) => (
  <button
    className={cn(
      "flex cursor-pointer items-center justify-center border-none bg-transparent p-5 text-black",
      className
    )}
    {...props}
  />
);
