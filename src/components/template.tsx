import { Nav } from "./nav";

export function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col p-0 m-0">
      <Nav />
      {children}
    </div>
  );
}
