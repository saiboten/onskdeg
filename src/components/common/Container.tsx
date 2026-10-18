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
      "mx-auto w-full max-w-870 px-16 py-8 text-[1.6rem] sm:px-24",
      textLeft ? "text-left" : "text-center",
      className
    )}
    {...props}
  />
);
