export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-black rounded-lg p-4">
      {children}
    </div>
  );
}
