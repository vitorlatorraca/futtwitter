import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth-context";
import Layout from "./components/layout/Layout";
import ComposeModal from "./components/modals/ComposeModal";
import ImageLightbox from "./components/modals/ImageLightbox";
import Toast from "./components/modals/Toast";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import { ProfileRedirect } from "./components/auth/ProfileRedirect";

const LoginPage = lazy(() => import("./pages/login"));
const SignupPage = lazy(() => import("./pages/signup"));
const TeamSelectionPage = lazy(() => import("./pages/team-selection"));
const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const FollowersList = lazy(() => import("./pages/FollowersList"));
const FollowingList = lazy(() => import("./pages/FollowingList"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Settings = lazy(() => import("./pages/Settings"));
const SettingsConta = lazy(() => import("./pages/settings/SettingsConta"));
const SettingsPrivacidade = lazy(() => import("./pages/settings/SettingsPrivacidade"));
const SettingsAdmin = lazy(() => import("./pages/settings/SettingsAdmin"));
const MeuTimeFeed = lazy(() => import("./pages/MeuTimeFeed"));
const VaiEVemFeed = lazy(() => import("./pages/VaiEVemFeed"));
const JogosFeed = lazy(() => import("./pages/JogosFeed"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));

// ============================================
// REACT ERROR BOUNDARY
// Captura erros não tratados na árvore de componentes
// e exibe UI de fallback em vez de travar a tela
// ============================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Em produção, enviar para um serviço de monitoramento (ex: Sentry)
    console.error("[ErrorBoundary] Erro não tratado:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6">
          <div className="max-w-md text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h1 className="text-2xl font-extrabold text-white">Algo deu errado</h1>
            <p className="text-gray-400 text-[15px] leading-relaxed">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Recarregar página
            </button>
            {/* Detalhes do erro somente em desenvolvimento */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left text-xs text-gray-500 bg-gray-900 rounded-xl p-4 border border-gray-800">
                <summary className="cursor-pointer font-semibold mb-2 text-gray-300">
                  Detalhes do erro (dev only)
                </summary>
                <pre className="whitespace-pre-wrap break-all text-red-400">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-x-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="py-16 px-8 text-center">
      <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
      <p className="text-x-text-secondary text-[15px]">Esta página estará disponível em breve.</p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public auth routes - redirect to /profile if already logged in */}
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/cadastro" element={<GuestRoute><SignupPage /></GuestRoute>} />
                <Route path="/selecionar-time" element={<GuestRoute><TeamSelectionPage /></GuestRoute>} />

                {/* Protected app - requires authentication */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<ProfileRedirect />} />
                  <Route path="/profile" element={<ProfileRedirect />} />
                  <Route path="/profile/:handle" element={<Profile />} />
                  <Route path="/profile/:handle/followers" element={<FollowersList />} />
                  <Route path="/profile/:handle/following" element={<FollowingList />} />
                  <Route path="/feed" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:id" element={<Messages />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/posts" element={<Navigate to="/feed" replace />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settings/conta" element={<SettingsConta />} />
                  <Route path="/settings/privacidade" element={<SettingsPrivacidade />} />
                  <Route path="/settings/admin" element={<SettingsAdmin />} />
                  <Route path="/meu-time" element={<MeuTimeFeed />} />
                  <Route path="/vai-e-vem" element={<VaiEVemFeed />} />
                  <Route path="/jogos" element={<JogosFeed />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="*" element={<PlaceholderPage title="Página não encontrada" />} />
                </Route>
              </Routes>
            </Suspense>
            <ComposeModal />
            <ImageLightbox />
            <Toast />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
