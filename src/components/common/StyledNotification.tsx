import { useState } from "react";
import { cn } from "../../util/cn";

export const useNotification = (text: string) => {
  const [active, setActive] = useState(false);

  function flash() {
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 2500);
  }

  return { flash, element: <StyledNotification active={active} text={text} /> };
};

/** A toast at the bottom of the screen. */
export const StyledNotification = ({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "pointer-events-none fixed bottom-24 left-1/2 z-50 max-w-[calc(100vw-3.2rem)] -translate-x-1/2 rounded-full bg-secondary px-20 py-10 text-center text-[1.5rem] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out",
      active ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
    )}
  >
    {text}
  </div>
);
