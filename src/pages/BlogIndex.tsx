import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { formatBlogDate } from "../utils/dateFormat";

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
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].date &&
          !isNaN(Date.parse(data[0].date))
        ) {
          data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
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
    <section className="max-w-4xl mx-auto px-[1em] py-2 md:px-2 mt-[4em]">
      <h1 className="font-DM_Mono text-3xl md:text-4xl mb-8 tracking-tight underline">Blog</h1>
      <div className="relative pl-6 md:pl-8">
        {/* Timeline vertical line - made longer by using inset-y-0 */}
        <div
          className="absolute left-2 md:left-3 inset-y-0 w-0.5 bg-gray-200 dark:bg-gray-700"
          aria-hidden="true"
        />
        <ul className="space-y-10">
          {posts.map((post, idx) => (
            <li key={idx} className="relative flex items-start group py-[50px]">
              {/* Timeline dot */}
              <span className="absolute left-0 top-1/2 -translate-y-1/2 md:left-0 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-gray-900 shadow-md" />
              <div className="flex-1 ml-6 md:ml-8">
                <button
                  type="button"
                  className="font-DM_Mono text-left text-blue-700 dark:text-blue-400 font-medium text-xl md:text-lg hover:underline focus:underline transition-colors outline-none"
                  onClick={() => handlePostClick(post.filename)}
                  aria-label={`Read blog post: ${post.title}`}
                >
                  {post.title}
                </button>
                <div className="font-DM_Mono text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {formatBlogDate(post.date)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {posts.length === 0 && (
          <div className="font-DM_Mono text-gray-400 dark:text-gray-500 mt-8 text-center">
            No blog posts found.
          </div>
        )}
      </div>
    </section>
  );

  let pageContent;
  if (loading) pageContent = renderLoading();
  else if (error) pageContent = renderError();
  else pageContent = renderPosts();

  return (
    <BaseLayout
      content={
        <div className="mx-[0.5em] md:mx-[4em] my-[8em] py-8 sm:px-2 sm:py-12 md:px-16 md:py-20 lg:px-32 lg:py-24">
          {pageContent}
        </div>
      }
      contentPadding={false}
    />
  );
};

export default BlogIndex;
