import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const TabContainer = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    role="tablist"
    className={cn("mb-24 flex flex-wrap gap-8", className)}
    {...props}
  />
);

export const Tab = ({
  $active,
  className,
  ...props
}: ComponentProps<"button"> & { $active: boolean }) => (
  <button
    type="button"
    role="tab"
    aria-selected={$active}
    className={cn(
      "min-h-36 cursor-pointer rounded-full border-2 border-solid px-16 py-4 font-sans text-[1.4rem] text-text transition-colors duration-200",
      $active
        ? "border-secondary bg-secondary font-semibold"
        : "border-secondary-dark bg-transparent hover:border-secondary",
      className,
    )}
    {...props}
  />
);
