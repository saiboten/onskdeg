import React from "react";
import FloatingCircles from "../common/FloatingCircles";
import { UnstyledLink } from "../common/Link";

const footerLink = "opacity-70 hover:opacity-100";

export const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center [background:radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_60%),var(--color-primary-dark)] px-16 pt-40 pb-24 text-text">
      <div className="pointer-events-none fixed inset-0 -z-1 opacity-60">
        <FloatingCircles />
      </div>
      <UnstyledLink
        to="/"
        className="mb-40 text-[3.2rem] font-bold tracking-[0.3rem]"
      >
        GAVEØNSKE.NO
      </UnstyledLink>
      <main className="flex w-full flex-1 flex-col items-center">
        {children}
      </main>
      <footer className="mt-40 flex gap-24 text-[1.4rem]">
        <UnstyledLink to="/privacypolicy" className={footerLink}>
          Personvern
        </UnstyledLink>
        <UnstyledLink to="/tos" className={footerLink}>
          Vilkår
        </UnstyledLink>
      </footer>
    </div>
  );
};
