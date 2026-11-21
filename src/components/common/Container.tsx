import { ComponentProps } from "react";
import { cn } from "../../util/cn";

interface ContainerProps extends ComponentProps<"div"> {
  /** Kept for older callers; content is left-aligned by default. */
  textLeft?: boolean;
  wide?: boolean;
}

export const Container = ({
  textLeft: _textLeft,
  wide,
  className,
  ...props
}: ContainerProps) => (
  <div
    className={cn(
      "mx-auto w-full px-16 text-left text-[1.6rem] sm:px-32",
      wide ? "max-w-900" : "max-w-760",
      className,
    )}
    {...props}
  />
);
