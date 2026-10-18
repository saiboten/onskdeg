import { ComponentProps } from "react";
import { cn } from "../../util/cn";

export const ListRow = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "relative mb-10 flex min-h-52 items-center justify-between gap-8 rounded-[10px] bg-primary py-4 pr-8 pl-16 text-left text-text",
      className
    )}
    {...props}
  />
);

export const LeftSection = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex min-w-0 shrink items-center overflow-hidden wrap-break-word",
      className
    )}
    {...props}
  />
);

export default ListRow;
