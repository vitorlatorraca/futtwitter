import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const LandingPage = lazy(() => import("@/pages/landing"));

function LandingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Public marketing home at `/`. Authenticated users skip straight to the app shell.
 */
export function LandingOrRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LandingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={<LandingSpinner />}>
      <LandingPage />
    </Suspense>
  );
}
