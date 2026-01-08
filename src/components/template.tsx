import { Nav } from "./nav";

export function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-dvw h-dvh flex bg-yellow-400 flex-col p-0 m-0">
      <Nav />
      <div className="flex flex-1 flex-col justify-center items-center p-4 bg-gray-200 overflow-auto">
        {children}
      </div>
    </div>
  );
}
