export function Modal({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center bg-black/50 z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="flex flex-col bg-white p-4 rounded-lg shadow-lg border border-black relative max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-1 border border-black rounded-lg bg-secondary text-white cursor-pointer hover:bg-accent hover:text-black active:bg-accent"
          onClick={() => setIsOpen(false)}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
