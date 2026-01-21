import type { FC } from "react";

type Props = {
  slug: string;
};

/**
 * Like button scaffold.
 * Requires GitHub OAuth for full implementation.
 * See: https://github.com/cheonglol/cheonglol/issues (GitHub OAuth issue)
 */
export const LikeButton: FC<Props> = ({ slug }) => {
  return (
    <button
      className="like-btn"
      disabled
      aria-label="Like this post (coming soon)"
    >
      <span className="like-emoji">🩶</span>
      <span className="like-count">—</span>
    </button>
  );
};
