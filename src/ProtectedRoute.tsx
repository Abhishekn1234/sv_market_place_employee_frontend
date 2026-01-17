import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuthStore } from "@/core/store/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  // Not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → render page
  return children;
};

export default ProtectedRoute;
