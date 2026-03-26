import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * For login/signup pages. Redirects to /profile when user is already authenticated.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-2 border-x-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
