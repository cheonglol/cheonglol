import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostModal } from "./PostModal";
import { LikeButton } from "./LikeButton";

type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  categories: string[];
  content: string;
};

type Props = {
  posts: Post[];
};

function BlogPostsInner({ posts }: Props) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <>
      <div className="posts-list">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="card post-card"
            onClick={() => setSelectedPost(post)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedPost(post)}
          >
            <h3>{post.title}</h3>
            <p className="text-muted">{post.date}</p>
            <p>{post.description}</p>
            <div className="post-card-footer">
              <div className="tags">
                {post.categories.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
              <LikeButton slug={post.slug} />
            </div>
          </article>
        ))}
      </div>
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}

export function BlogPosts({ posts }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BlogPostsInner posts={posts} />
    </QueryClientProvider>
  );
}
