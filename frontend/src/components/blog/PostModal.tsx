import { useEffect, useState } from "react";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  categories: string[];
  agentWritten?: boolean;
};

type Props = {
  post: Post | null;
  onClose: () => void;
};

type ContentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; html: string }
  | { status: "error" };

/**
 * Fetches the rendered HTML for a single post.
 * The JSON file is generated at build time by /blog/[slug].json.ts.
 */
async function fetchPostContent(slug: string): Promise<string> {
  const url = `${import.meta.env.BASE_URL}blog/${slug}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load post ${slug}`);
  const data = (await res.json()) as { content: string };
  return data.content;
}

export function PostModal({ post, onClose }: Props) {
  const [content, setContent] = useState<ContentState>({ status: "idle" });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (post) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [post, onClose]);

  // Lazy-load the post content only when a post is opened.
  useEffect(() => {
    if (!post) {
      setContent({ status: "idle" });
      return;
    }
    let cancelled = false;
    setContent({ status: "loading" });
    fetchPostContent(post.slug)
      .then((html) => {
        if (!cancelled) setContent({ status: "ready", html });
      })
      .catch(() => {
        if (!cancelled) setContent({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [post]);

  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <article>
          {post.agentWritten && (
            <span className="reported-badge">Reported</span>
          )}
          <h2>{post.title}</h2>
          <p className="text-muted">{post.date}</p>
          <div className="modal-tags">
            {post.categories.map((c) => (
              <span key={c} className="chip">
                #{c}
              </span>
            ))}
          </div>
          {content.status === "loading" && (
            <div className="modal-body" aria-busy="true">
              <p className="text-muted">Loading post…</p>
            </div>
          )}
          {content.status === "ready" && (
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          )}
          {content.status === "error" && (
            <div className="modal-body">
              <p className="text-muted">
                Failed to load this post. Close and try again.
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
