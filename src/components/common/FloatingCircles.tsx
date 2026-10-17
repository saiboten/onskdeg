function getRandomInt(min: number, max: number) {
  var num = Math.floor(Math.random() * Math.floor(max));
  if (num < min) {
    num += min;
  }
  return num;
}

export default function FloatingCircles() {
  const circles = Array(15)
    .fill(0)
    .map((_, index) => {
      const size = `${getRandomInt(50, 500)}px`;
      return (
        <div
          key={index}
          className="absolute rounded-full bg-primary [filter:opacity(0.5)]"
          style={{
            width: size,
            height: size,
            top: `${getRandomInt(0, 100)}%`,
            left: `${getRandomInt(0, 100)}%`,
            animation: `float ${getRandomInt(5, 30)}s linear infinite alternate`,
          }}
        />
      );
    });

  return (
    <div className="relative h-full w-full overflow-hidden">{circles}</div>
  );
}
