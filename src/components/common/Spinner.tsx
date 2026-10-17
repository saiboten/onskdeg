import { cn } from "../../util/cn";

// The ring uses `transform` (not `translate`) so the spin animation replaces
// the offset while running, as it always has.
const Spinner = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex h-24 w-24 items-center justify-center",
      "after:block after:h-24 after:w-24 after:rounded-full after:border-3 after:border-solid after:border-x-transparent after:border-y-white after:content-['_'] after:[transform:translateY(50%)] after:animate-spinner",
      className
    )}
  />
);

export default Spinner;
