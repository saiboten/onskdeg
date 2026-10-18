import { ComponentProps } from "react";
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  NavLinkProps,
} from "react-router-dom";
import { cn } from "../../util/cn";

const underlined =
  "[border-bottom:2px_solid_var(--color-secondary)] font-normal text-text no-underline wrap-break-word";

export const Link = ({
  className,
  ...props
}: ComponentProps<typeof RouterLink>) => (
  <RouterLink
    className={cn(underlined, "hover:opacity-75", className)}
    {...props}
  />
);

export const ALink = ({ className, ...props }: ComponentProps<"a">) => (
  <a
    className={cn(underlined, "cursor-pointer hover:opacity-75", className)}
    {...props}
  />
);

export const UnstyledLink = ({
  className,
  ...props
}: ComponentProps<typeof RouterLink>) => (
  <RouterLink
    className={cn("font-normal text-text no-underline", className)}
    {...props}
  />
);

type StyledNavLinkProps = Omit<NavLinkProps, "className"> & {
  className?: string;
};

export const NavLink = ({ className, ...props }: StyledNavLinkProps) => (
  <RouterNavLink
    className={cn(
      "rounded-[1.5rem] bg-secondary-dark px-20 py-8 text-center text-[2rem] font-normal text-text no-underline transition-all duration-200 ease-in-out",
      "max-[450px]:flex-1 max-[450px]:px-12 max-[450px]:text-[1.8rem]",
      "[&.selected]:bg-secondary [&.selected]:font-bold [&.selected]:text-text [&.selected]:shadow-[0_4px_8px_rgba(0,0,0,0.3)]",
      className
    )}
    {...props}
  />
);
