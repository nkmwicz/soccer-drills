export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col border border-black rounded-lg p-4 ${className}`}
    >
      {children}
    </div>
  );
}
