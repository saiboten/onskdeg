import { ComponentProps } from "react";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "../../util/cn";

export const StyledLink = ({ className, ...props }: ComponentProps<"a">) => (
  <a className={cn("translate-y-3 px-5", className)} {...props} />
);

export const StyledLinkIcon = () => (
  <LinkIcon className="h-32 w-32 text-text" />
);
