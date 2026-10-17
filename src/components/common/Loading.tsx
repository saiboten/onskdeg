const bar = "absolute inline-block w-13 bg-secondary animate-bars";

export default () => (
  <div className="relative inline-block h-64 w-64">
    <div className={`${bar} left-6 [animation-delay:-0.24s]`} />
    <div className={`${bar} left-26 [animation-delay:-0.12s]`} />
    <div className={`${bar} left-45 [animation-delay:0s]`} />
  </div>
);
