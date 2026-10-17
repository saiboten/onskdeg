import { ComponentProps } from "react";
import { cn } from "../../util/cn";

interface ContainerProps extends ComponentProps<"div"> {
  textLeft?: boolean;
}

export const Container = ({
  textLeft,
  className,
  ...props
}: ContainerProps) => (
  <div
    className={cn(
      "mx-auto max-w-870 rounded-[3px] p-5 text-[1.6rem]",
      textLeft ? "text-left" : "text-center",
      className
    )}
    {...props}
  />
);
