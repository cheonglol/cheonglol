import { useState, useEffect, useRef } from "react";
import { useLikes, useLikeMutation, useUnlikeMutation } from "../hooks/usePosts";

const UUID_KEY = "cheonglol-user-id";
const COOLDOWN_MS = 2000;

// Get or create persistent user UUID
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
  const { data, isLoading, refetch } = useLikes(slug, userId);
  const likeMutation = useLikeMutation(slug, userId);
  const unlikeMutation = useUnlikeMutation(slug, userId);
  const [cooldown, setCooldown] = useState(false);
  const lastClickRef = useRef(0);

  // The server tells us if this user has liked
  const isLiked = data?.userLiked ?? false;
  const count = data?.count ?? 0;

  const isPending = likeMutation.isPending || unlikeMutation.isPending;
  const isDisabled = isPending || cooldown || !userId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const now = Date.now();
    if (now - lastClickRef.current < COOLDOWN_MS) return;
    lastClickRef.current = now;
    
    if (isDisabled) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), COOLDOWN_MS);

    if (isLiked) {
      unlikeMutation.mutate(undefined, { onSuccess: () => refetch() });
    } else {
      likeMutation.mutate(undefined, { onSuccess: () => refetch() });
    }
  };

  return (
    <button
      className={`like-btn ${isLiked ? "liked" : ""} ${cooldown ? "cooldown" : ""}`}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={isLiked ? "Unlike this post" : "Like this post"}
      title={cooldown ? "Please wait..." : isLiked ? "Click to unlike" : "Click to like"}
    >
      <span className="like-emoji">{isLiked ? "💖" : "🩶"}</span>
      <span className="like-count">{isLoading ? "..." : count}</span>
    </button>
  );
}
    </button>
  );
}
