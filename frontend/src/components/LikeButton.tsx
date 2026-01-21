import { useState, useRef } from "react";
import { useLikes, useToggleLike } from "../hooks/usePosts";

const UUID_KEY = "cheonglol-user-id";

function getUserId(): string {
  if (typeof window === "undefined") return "";
  let userId = localStorage.getItem(UUID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(UUID_KEY, userId);
  }
  return userId;
}

type Props = {
  slug: string;
};

export function LikeButton({ slug }: Props) {
  const userId = getUserId();
  const { data, isLoading } = useLikes(slug, userId);
  const toggleMutation = useToggleLike(slug, userId);

  const isLiked = data?.userLiked ?? false;
  const count = data?.count ?? 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleMutation.isPending || !userId) return;
    toggleMutation.mutate();
  };

  return (
    <button
      className={`like-btn ${isLiked ? "liked" : ""}`}
      onClick={handleClick}
      disabled={toggleMutation.isPending || !userId}
      aria-label={isLiked ? "Unlike this post" : "Like this post"}
      title={isLiked ? "Click to unlike" : "Click to like"}
    >
      <span className="like-emoji">{isLiked ? "💖" : "🩶"}</span>
      <span className="like-count">{isLoading ? "..." : count}</span>
    </button>
  );
}
