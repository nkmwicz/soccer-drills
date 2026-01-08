import { useAtomValue } from "jotai";
import { Navigate } from "react-router";
import { userNameState } from "../utils/globalState";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAtomValue(userNameState);

  if (!user.name) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
