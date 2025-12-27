import { Navigate } from "react-router-dom";
import type { JSX } from "react";
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check if user is logged in (token exists)
  const employeeData = localStorage.getItem("employeeData");
  
  if (!employeeData) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Logged in, render the children
  return children;
};

export default ProtectedRoute;
