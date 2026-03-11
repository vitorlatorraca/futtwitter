import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { mockPosts } from "../data/mockPosts";
import PostCard from "../components/feed/PostCard";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { posts: storePosts, currentUser } = useAppStore();
  const allPosts = [...storePosts, ...mockPosts];
  const bookmarked = allPosts.filter((p) => p.bookmarked);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Salvos</h1>
          <p className="text-[13px] text-x-text-secondary">@{currentUser.handle}</p>
        </div>
      </div>

      {bookmarked.length > 0 ? (
        bookmarked.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="py-16 px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-2">Salve posts para depois</h2>
          <p className="text-x-text-secondary text-[15px] max-w-[360px] mx-auto">
            Salve posts para encontrá-los facilmente no futuro.
          </p>
        </div>
      )}
    </div>
  );
}
