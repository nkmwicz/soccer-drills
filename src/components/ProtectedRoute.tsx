import { useAtomValue } from "jotai";
import { Navigate } from "react-router";
import { activeUserState } from "../utils/globalState";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAtomValue(activeUserState);

  if (!user.name) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
