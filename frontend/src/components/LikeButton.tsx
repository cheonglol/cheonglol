import { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState("");
  const [mounted, setMounted] = useState(false);

  // Get userId on client side only
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useLikes(slug, userId);
  const toggleMutation = useToggleLike(slug, userId);

  // Debug logging
  useEffect(() => {
    if (error)
      console.error("[LikeButton] Like fetch error:", error, { slug, userId });
  }, [error, slug, userId]);

  useEffect(() => {
    if (toggleMutation.error) {
      console.error("[LikeButton] Toggle error:", toggleMutation.error, {
        slug,
        userId,
      });
    }
  }, [toggleMutation.error, slug, userId]);

  const isLiked = data?.userLiked ?? false;
  const count = data?.count ?? 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleMutation.isPending || !userId) return;
    toggleMutation.mutate();
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="like-btn" disabled aria-label="Like this post">
        <span className="like-emoji">🩶</span>
        <span className="like-count">…</span>
      </button>
    );
  }

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
