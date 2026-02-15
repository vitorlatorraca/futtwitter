import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import TeamSelectionPage from "@/pages/team-selection";
import DashboardPage from "@/pages/dashboard";
import MeuTimePage from "@/pages/meu-time";
import MeuTimeElencoPage from "@/pages/meu-time-elenco";
import MeuTimeComunidadeTopicPage from "@/pages/meu-time-comunidade";
import { MatchesPage } from "@/features/team/matches";
import PerfilPage from "@/pages/perfil";
import JornalistaPage from "@/pages/jornalista";
import JogosParaSeDivertirPage from "@/pages/jogos-para-se-divertir";
import VaiEVemPage from "@/pages/vai-e-vem";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  // Check if user has selected a team
  if (!user.teamId && window.location.pathname !== '/selecionar-time') {
    return <Redirect to="/selecionar-time" />;
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user && user.teamId) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicRoute component={LandingPage} />} />
      <Route path="/login" component={() => <PublicRoute component={LoginPage} />} />
      <Route path="/cadastro" component={() => <PublicRoute component={SignupPage} />} />
      <Route path="/selecionar-time" component={TeamSelectionPage} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/meu-time" component={() => <ProtectedRoute component={MeuTimePage} />} />
      <Route path="/meu-time/elenco" component={() => <ProtectedRoute component={MeuTimeElencoPage} />} />
      <Route path="/meu-time/comunidade/:topicId" component={() => <ProtectedRoute component={MeuTimeComunidadeTopicPage} />} />
      <Route path="/meu-time/jogos" component={() => <ProtectedRoute component={MatchesPage} />} />
      <Route path="/jogos" component={() => <ProtectedRoute component={JogosParaSeDivertirPage} />} />
      <Route path="/vai-e-vem" component={() => <ProtectedRoute component={VaiEVemPage} />} />
      <Route path="/perfil" component={() => <ProtectedRoute component={PerfilPage} />} />
      <Route path="/jornalista" component={() => <ProtectedRoute component={JornalistaPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
