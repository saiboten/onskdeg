import { ComponentProps } from "react";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "../../util/cn";

export const StyledLink = ({ className, ...props }: ComponentProps<"a">) => (
  <a
    className={cn(
      "flex h-36 w-36 shrink-0 items-center justify-center text-text transition-transform duration-200 ease-[ease] hover:scale-110",
      className
    )}
    {...props}
  />
);

export const StyledLinkIcon = () => <LinkIcon size={24} className="text-text" />;
