import React, { useState, useCallback } from "react";
import { useAppStore } from "../../store/useAppStore";
import PostCard from "./PostCard";
import ComposeBox from "./ComposeBox";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { mockPosts, generateMorePosts } from "../../data/mockPosts";
import { Loader2 } from "lucide-react";

export default function Feed() {
  const { posts, activeTab, setActiveTab } = useAppStore();
  const [feedPosts, setFeedPosts] = useState(mockPosts);
  const [loadCount, setLoadCount] = useState(0);

  const allPosts = [...posts, ...feedPosts];

  const loadMore = useCallback(() => {
    const nextCount = loadCount + 1;
    setLoadCount(nextCount);
    const morePosts = generateMorePosts(nextCount);
    setFeedPosts((prev) => [...prev, ...morePosts]);
  }, [loadCount]);

  const { sentinelRef, loading } = useInfiniteScroll(loadMore);

  return (
    <div>
      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-x-border">
        <div className="flex">
          {(["for-you", "following"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] font-medium"
            >
              <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>
                {tab === "for-you" ? "Para você" : "Seguindo"}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compose Box */}
      <div className="border-b border-x-border">
        <ComposeBox />
      </div>

      {/* Posts */}
      <div>
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-8 flex items-center justify-center">
        {loading && <Loader2 className="w-8 h-8 text-x-accent animate-spin" />}
      </div>
    </div>
  );
}
