import { usePosts } from "../../hooks/usePosts";
import type { Post } from "../../types/orpc";

type Props = {
  className?: string;
  limit?: number;
  renderItem?: (post: Post) => React.ReactNode;
};

/**
 * PostsList - accessible, minimal presentation for a list of posts.
 * - shows loading skeleton, empty and error states
 * - accepts renderItem for custom rendering (used by portfolio pages)
 */
export default function PostsList({ className, limit, renderItem }: Props) {
  const q = usePosts();

  if (q.isLoading) {
    return (
      <div className={className ?? "loading"} aria-busy="true">
        <p>Loading posts…</p>
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className={className} role="status">
        <p className="text-muted">Unable to load posts.</p>
      </div>
    );
  }

  const posts = (q.data ?? []).slice(0, limit ?? Infinity);
  if (posts.length === 0) return <div className={className}>No posts yet.</div>;

  return (
    <ul className={className}>
      {posts.map((p) => (
        <li key={p.id}>
          {renderItem ? (
            renderItem(p)
          ) : (
            <article>
              <a href={`/blog/${p.slug}`}>{p.title}</a>
              {p.summary ? <p>{p.summary}</p> : null}
              {p.categories && p.categories.length > 0 ? (
                <div>
                  {p.categories.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          )}
        </li>
      ))}
    </ul>
  );
}
