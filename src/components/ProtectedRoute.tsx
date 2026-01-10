import { useAtomValue } from "jotai";
import { Navigate } from "react-router";
import { activeUserState } from "../utils/globalState";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAtomValue(activeUserState);
  useEffect(() => {
    console.log("ProtectedRoute check user:", user);
  }, [user]);
  if (!user.name) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
