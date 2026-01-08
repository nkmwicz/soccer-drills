export function Button({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      className="p-2 border border-black rounded-lg bg-secondary text-white cursor-pointer hover:bg-accent hover:text-black active:bg-accent bg:text-black"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
