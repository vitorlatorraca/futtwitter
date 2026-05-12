import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

/**
 * Redirects /profile to /profile/{handle} for the current user.
 * Must be used within ProtectedRoute (user is guaranteed).
 */
export function ProfileRedirect() {
  const { user } = useAuth();
  const handle = user?.handle;

  if (!handle) {
    // User has no handle yet; fallback to settings or a default
    return <Navigate to="/settings" replace />;
  }

  return <Navigate to={`/profile/${handle}`} replace />;
}
