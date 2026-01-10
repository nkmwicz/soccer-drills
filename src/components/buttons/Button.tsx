export function Button({
  title,
  onClick,
  className = "",
}: {
  title: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`p-2 border border-black rounded-lg bg-secondary text-white cursor-pointer hover:bg-accent hover:text-black active:bg-accent ${className}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
