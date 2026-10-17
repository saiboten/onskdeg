import { useState } from "react";
import { cn } from "../../util/cn";

export const useNotification = (text: string) => {
  const [active, setActive] = useState(false);

  function flash() {
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 2000);
  }

  return { flash, element: <StyledNotification active={active} text={text} /> };
};

export const StyledNotification = ({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) => (
  <div
    className={cn(
      "fixed top-0 left-0 z-10 flex w-screen items-center justify-center border border-solid border-black bg-contrast py-10 text-text transition-all duration-500 ease-[ease]",
      active ? "translate-y-0" : "-translate-y-50"
    )}
  >
    {text}
  </div>
);
