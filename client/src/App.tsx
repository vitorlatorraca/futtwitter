import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ComposeModal from "./components/modals/ComposeModal";
import ImageLightbox from "./components/modals/ImageLightbox";
import Toast from "./components/modals/Toast";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Settings = lazy(() => import("./pages/Settings"));
const MeuTimeFeed = lazy(() => import("./pages/MeuTimeFeed"));
const VaiEVemFeed = lazy(() => import("./pages/VaiEVemFeed"));
const JogosFeed = lazy(() => import("./pages/JogosFeed"));

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
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />
            <Route path="/profile/:handle" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/meu-time" element={<MeuTimeFeed />} />
            <Route path="/vai-e-vem" element={<VaiEVemFeed />} />
            <Route path="/jogos" element={<JogosFeed />} />
            <Route path="*" element={<PlaceholderPage title="Página não encontrada" />} />
          </Route>
        </Routes>
      </Suspense>
      <ComposeModal />
      <ImageLightbox />
      <Toast />
    </BrowserRouter>
  );
}
