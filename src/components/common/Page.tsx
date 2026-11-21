import { ComponentProps, ReactNode, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { cn } from "../../util/cn";
import { initials } from "../../util/format";

/** Page title with optional back link, subtitle and actions on the right. */
export const PageHeader = ({
  title,
  subtitle,
  back,
  actions,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
  actions?: ReactNode;
  className?: string;
}) => (
  <header className={cn("mb-24 text-left", className)}>
    {back && (
      <RouterLink
        to={back.to}
        className="mb-12 -ml-4 inline-flex items-center gap-2 text-[1.4rem] text-text no-underline opacity-70 transition-opacity hover:opacity-100"
      >
        <ChevronLeft size={18} />
        {back.label}
      </RouterLink>
    )}
    <div className="flex flex-wrap items-center justify-between gap-12">
      <div className="min-w-0">
        <h1 className="text-[2.8rem] leading-[1.2] font-semibold wrap-break-word max-[450px]:text-[2.4rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-[1.5rem] opacity-70">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-8">{actions}</div>
      )}
    </div>
  </header>
);

/** A rounded surface that groups related content. */
export const Panel = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("rounded-[14px] bg-primary p-16 sm:p-20", className)}
    {...props}
  />
);

/** A titled block of content with consistent spacing between sections. */
export const Section = ({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn("mb-32 text-left last:mb-0", className)}>
    {(title || actions) && (
      <div className="mb-12 flex flex-wrap items-end justify-between gap-12">
        <div className="min-w-0">
          {title && (
            <h2 className="text-[1.9rem] leading-[1.3] font-semibold">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-[1.4rem] opacity-70">{description}</p>
          )}
        </div>
        {actions}
      </div>
    )}
    {children}
  </section>
);

export const EmptyState = ({
  icon,
  title,
  children,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center gap-8 rounded-[14px] border-2 border-dashed border-secondary-dark px-24 py-32 text-center",
      className,
    )}
  >
    <div className="text-secondary">{icon ?? <Gift size={32} />}</div>
    <p className="text-[1.7rem] font-semibold">{title}</p>
    {children && <div className="text-[1.4rem] opacity-75">{children}</div>}
  </div>
);

const avatarColors = [
  "#a54fc0",
  "#3a7fd6",
  "#1d9a72",
  "#d0663a",
  "#c63f73",
  "#6c58c9",
  "#2a9bb0",
];

const colorFor = (name = "") =>
  avatarColors[
    [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
      avatarColors.length
  ];

export const Avatar = ({
  name,
  className,
}: {
  name: string | undefined;
  className?: string;
}) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex h-40 w-40 shrink-0 items-center justify-center rounded-full text-[1.4rem] font-bold text-white",
      className,
    )}
    style={{ backgroundColor: colorFor(name) }}
  >
    {initials(name)}
  </span>
);

/** Square product image, or a gift icon when there is none. */
export const WishThumb = ({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={cn(
        "flex h-48 w-48 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-primary-dark",
        className,
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full bg-white object-contain"
        />
      ) : (
        <Gift size={22} className="opacity-40" />
      )}
    </span>
  );
};

/** A menu-style row that links somewhere: icon, label, hint and a chevron. */
export const LinkRow = ({
  to,
  icon,
  label,
  description,
}: {
  to: string;
  icon?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
}) => (
  <RouterLink
    to={to}
    className="flex items-center gap-12 rounded-[10px] px-8 py-10 text-text no-underline transition-colors hover:bg-secondary-dark"
  >
    {icon && (
      <span className="flex h-36 w-36 shrink-0 items-center justify-center rounded-[10px] bg-primary-dark text-secondary">
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block font-semibold">{label}</span>
      {description && (
        <span className="block text-[1.3rem] opacity-70">{description}</span>
      )}
    </span>
    <ChevronRight size={18} className="shrink-0 opacity-50" />
  </RouterLink>
);

/** Stacks children with a thin divider between them. */
export const Divided = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col [&>*+*]:[border-top:1px_solid_var(--color-secondary-dark)]",
      className,
    )}
    {...props}
  />
);
