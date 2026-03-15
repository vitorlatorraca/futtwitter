import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserFollowers, useToggleFollow, useUserProfile } from "../hooks/useFollow";
import type { FollowListItem } from "../hooks/useFollow";

function UserCard({
  item,
  onNavigate,
  onToggleFollow,
  isLoading,
}: {
  item: FollowListItem;
  onNavigate: () => void;
  onToggleFollow: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] border-b border-x-border transition-colors">
      <div
        className="w-10 h-10 rounded-full bg-x-border flex-shrink-0 overflow-hidden cursor-pointer mt-0.5"
        onClick={onNavigate}
      >
        {item.avatarUrl ? (
          <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-x-text-secondary">
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="cursor-pointer min-w-0" onClick={onNavigate}>
            <p className="text-[15px] font-bold truncate">{item.name}</p>
            <p className="text-[13px] text-x-text-secondary truncate">@{item.handle}</p>
          </div>
          <button
            onClick={onToggleFollow}
            disabled={isLoading}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors disabled:opacity-60 ${
              item.isFollowing
                ? "border border-x-border text-white hover:border-red-500 hover:text-red-500"
                : "bg-white text-black hover:bg-[rgba(231,233,234,0.9)]"
            }`}
          >
            {isLoading ? "..." : item.isFollowing ? "Seguindo" : "Seguir"}
          </button>
        </div>
        {item.bio && (
          <p className="text-[14px] text-x-text-secondary mt-1 line-clamp-2">{item.bio}</p>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-x-border">
          <div className="w-10 h-10 rounded-full bg-x-border animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-x-border rounded animate-pulse w-32" />
            <div className="h-3 bg-x-border rounded animate-pulse w-20" />
          </div>
          <div className="w-20 h-8 bg-x-border rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-x-text-secondary">
      <svg className="w-12 h-12 opacity-30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z" />
      </svg>
      <p className="text-[15px] text-center px-8">{message}</p>
    </div>
  );
}

export default function FollowersList() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const profileQuery = useUserProfile(handle);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserFollowers(handle);
  const toggleFollow = useToggleFollow();

  const allItems: FollowListItem[] = data?.pages.flatMap((p) => p) ?? [];
  const userName = profileQuery.data?.name ?? handle;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-x-border">
        <button onClick={() => navigate(-1)} className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{userName}</h1>
          <p className="text-[13px] text-x-text-secondary">@{handle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-x-border">
        <button
          onClick={() => handle && navigate(`/profile/${handle}/followers`)}
          className="flex-1 py-4 text-[15px] font-semibold border-b-2 border-[#1d9bf0] text-white"
        >
          Seguidores
        </button>
        <button
          onClick={() => handle && navigate(`/profile/${handle}/following`)}
          className="flex-1 py-4 text-[15px] text-x-text-secondary hover:bg-[rgba(231,233,234,0.03)]"
        >
          Seguindo
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <SkeletonList />
      ) : allItems.length === 0 ? (
        <EmptyState message={handle ? `@${handle} ainda não tem seguidores.` : "Nenhum seguidor."} />
      ) : (
        <div>
          {allItems.map((item) => (
            <UserCard
              key={item.id}
              item={item}
              onNavigate={() => navigate(`/profile/${item.handle}`)}
              onToggleFollow={() =>
                toggleFollow.mutate({ handle: item.handle, follow: !item.isFollowing })
              }
              isLoading={toggleFollow.isPending && toggleFollow.variables?.handle === item.handle}
            />
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-4 text-[#1d9bf0] text-[15px] hover:bg-[rgba(29,155,240,0.1)] transition-colors"
            >
              {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
