import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";

type Post = {
  filename: string;
  title: string;
  date: string;
};

const LOADING_DOTS = [0, 1, 2];

const BlogIndex = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePostClick = useCallback(
    (filename: string) => {
      navigate(`/cheonglol/blog/${filename}`);
    },
    [navigate]
  );

  useEffect(() => {
    let isMounted = true;
    const fetchManifest = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/cheonglol/blog/blogContentManifest.json");
        if (!res.ok) throw new Error("Manifest not found");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid manifest format");
        if (isMounted) setPosts(data);
      } catch {
        if (isMounted) {
          setError("Failed to load blog posts.");
          setPosts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchManifest();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderLoading = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-center items-center h-32">
        <AnimatePresence>
          <motion.div
            className="flex space-x-1 text-4xl"
            initial={false}
            aria-label="Loading"
            role="status"
          >
            {LOADING_DOTS.map((i) => (
              <motion.span
                key={i}
                initial={{ y: 0, opacity: 0.5 }}
                animate={{ y: -12, opacity: 1 }}
                exit={{ y: 0, opacity: 0.5 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.6,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                •
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-red-600">{error}</div>
    </div>
  );

  const renderPosts = () => (
    <section className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-DM_Mono text-5xl md:text-4xl mb-8 tracking-tight">Blog</h1>
      <ul>
        {posts.map((post, idx) => (
          <li key={post.filename} className="flex flex-col gap-1">
            <button
              type="button"
              className="text-left text-blue-700 dark:text-blue-400 font-medium text-2xl hover:underline focus:underline transition-colors outline-none"
              onClick={() => handlePostClick(post.filename)}
              aria-label={`Read blog post: ${post.title}`}
            >
              {post.title}
            </button>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{post.date}</span>
            {idx < posts.length - 1 && <hr className="my-8 border-gray-200 dark:border-gray-700" />}
          </li>
        ))}
      </ul>
      {posts.length === 0 && (
        <div className="text-gray-400 dark:text-gray-500 mt-8 text-center">
          No blog posts found.
        </div>
      )}
    </section>
  );

  let pageContent;
  if (loading) pageContent = renderLoading();
  else if (error) pageContent = renderError();
  else pageContent = renderPosts();

  return <BaseLayout content={pageContent} />;
};

export default BlogIndex;
