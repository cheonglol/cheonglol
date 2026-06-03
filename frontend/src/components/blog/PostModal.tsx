import { useEffect } from "react";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  categories: string[];
  content: string;
};

type Props = {
  post: Post | null;
  onClose: () => void;
};

export function PostModal({ post, onClose }: Props) {
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

  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <article>
          <h2>{post.title}</h2>
          <p className="text-muted">{post.date}</p>
          <div className="modal-tags">
            {post.categories.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div
            className="modal-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
