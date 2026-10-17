import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const TabContainer = (props: ComponentProps<"div">) => (
  <div className="mb-20 flex flex-wrap justify-center gap-5" {...props} />
);

export const Tab = ({
  $active,
  className,
  ...props
}: ComponentProps<"button"> & { $active: boolean }) => (
  <button
    className={cn(
      "cursor-pointer rounded-[8px] border-2 border-solid border-secondary px-20 py-10 text-[1.6rem] text-text transition-all duration-200 ease-[ease] hover:-translate-y-1 hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:translate-y-0",
      $active ? "bg-secondary font-semibold" : "bg-transparent font-normal",
      className
    )}
    {...props}
  />
);
