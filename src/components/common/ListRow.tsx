import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const ListRow = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "relative mb-2 flex min-h-52 items-center justify-between rounded-[10px] bg-primary pl-15 text-left text-text not-last:mb-10",
      className
    )}
    {...props}
  />
);

export const LeftSection = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("flex shrink items-center overflow-hidden", className)}
    {...props}
  />
);

export default ListRow;
