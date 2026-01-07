export function Button({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      className="p-2 border border-black rounded-lg bg-blue-950 text-white"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
