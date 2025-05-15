import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { formatBlogDate } from "../utils/dateFormat";

// Remove StyleWrapper import
// import StyleWrapper from "../components/StyleWrapper";

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const { filename } = useParams<{ filename: string }>();
  const [content, setContent] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [postMeta, setPostMeta] = useState<{ title: string; date: string } | null>(null);
  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const speechSupportedRef = useRef<boolean>(false);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis;
      speechSupportedRef.current = true;
    }

    // Cleanup speech synthesis on unmount
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  // Text-to-speech functions
  const extractTextFromMarkdown = (markdown: string): string => {
    // Simple regex to remove most markdown syntax for reading
    return markdown
      .replace(/#{1,6}\s+/g, "") // Remove headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace links with just text
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, "Image: $1") // Replace images with description
      .replace(/\n/g, " ")
      .replace(/\s+/g, " "); // Normalize whitespace
  };

  const startSpeech = () => {
    if (!speechSupportedRef.current || !speechSynthRef.current || !content) return;

    // Cancel any ongoing speech
    speechSynthRef.current.cancel();

    // Extract readable text
    const textToRead = extractTextFromMarkdown(content);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Set speech properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Start speaking
    speechSynthRef.current.speak(utterance);
  };

  const stopSpeech = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech control component
  const SpeechControls = () => {
    if (!speechSupportedRef.current) {
      return null;
    }

    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        {isSpeaking ? (
          <button
            onClick={stopSpeech}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full flex items-center shadow-lg"
          >
            <span className="mr-2">Stop Reading</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <rect x="6" y="6" width="8" height="8" />
            </svg>
          </button>
        ) : (
          <button
            onClick={startSpeech}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full flex items-center shadow-lg"
            disabled={loading || notFound || !content}
          >
            <span className="mr-2">Read Aloud</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 15a1 1 0 0 1-1-1V6a1 1 0 0 1 1.5-.86l6 4a1 1 0 0 1 0 1.72l-6 4A1 1 0 0 1 10 15z" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  // DRY: Back to Blog Index button
  const BackToIndexButton = (
    <button
      onClick={() => {
        navigate("/cheonglol/blog");
      }}
      className="text-blue-600 hover:underline mt-4 inline-block"
    >
      ← Back to Blog Index
    </button>
  );

  useEffect(() => {
    if (!filename) {
      setNotFound(true);
      setContent("");
      setLoading(false);
      return;
    }
    setNotFound(false);
    setLoading(true);
    // Ensure filename ends with .md
    let mdFilename = filename;
    if (!filename.endsWith(".md")) {
      if (filename.includes(".")) {
        setNotFound(true);
        setContent("");
        setLoading(false);
        return;
      }
      mdFilename = `${filename}.md`;
    }

    const fetchContent = async () => {
      try {
        const res = await fetch(`/cheonglol/blog/contents/${mdFilename}`);
        if (!res.ok) throw new Error("Not found");
        const text = await res.text();
        setContent(text);
        setLoading(false);
      } catch {
        setNotFound(true);
        setContent("");
        setLoading(false);
      }
    };

    fetchContent();
  }, [filename]);

  useEffect(() => {
    let isMounted = true;
    const fetchManifest = async () => {
      if (!filename) return;
      try {
        const res = await fetch("/cheonglol/blog/blogContentManifest.json");
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const post = data.find(
          (p: { filename: string }) => p.filename === filename || p.filename === `${filename}.md`
        );
        if (post && isMounted) setPostMeta({ title: post.title, date: post.date });
        else if (isMounted) setPostMeta(null);
      } catch {
        if (isMounted) setPostMeta(null);
      }
    };
    fetchManifest();
    return () => {
      isMounted = false;
    };
  }, [filename]);

  // Set window title to post title
  useEffect(() => {
    if (postMeta?.title) {
      document.title = postMeta.title;
    }
    // Optionally reset title on unmount
    // return () => { document.title = "Blog"; };
  }, [postMeta?.title]);

  // Add markdownComponents here (copied from StyleWrapper)
  const markdownComponents: Components = {
    h1: (props) => (
      <h1 className="text-4xl font-bold mt-12 mb-8 border-b-2 pb-2 tracking-wide" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-3xl font-semibold mt-10 mb-6 font-DM_Mono tracking-wide" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-2xl font-semibold mt-8 mb-4 font-DM_Mono tracking-wide" {...props} />
    ),
    h4: (props) => (
      <h4 className="text-xl font-semibold mt-6 mb-3 font-DM_Mono tracking-wide" {...props} />
    ),
    p: (props) => <p className="mb-6 leading-8" {...props} />,
    ul: (props) => <ul className="list-disc ml-8 mb-6 space-y-2" {...props} />,
    ol: (props) => <ol className="list-decimal ml-8 mb-6 space-y-2" {...props} />,
    li: (props) => <li className="mb-2" {...props} />,
    a: (props) => (
      <a
        className="text-blue-600 underline hover:text-blue-800 font-DM_Mono"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-6 text-gray-600 my-8 bg-gray-50 py-4"
        {...props}
      />
    ),
    code: (props) => {
      const { inline, className, children, ...rest } = props as {
        inline?: boolean;
        className?: string;
        children?: React.ReactNode;
      };
      return inline ? (
        <code
          className={`bg-gray-100 rounded px-2 py-1 font-DM_Mono text-base ${className ?? ""}`}
          {...rest}
        >
          {children}
        </code>
      ) : (
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto my-8 font-DM_Mono text-base">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    },
    em: ({ children, ...props }) => <em {...props}>{children}</em>,
    i: ({ children, ...props }) => <i {...props}>{children}</i>,
    img: (props) => <img className="max-w-full rounded-lg my-8 shadow-lg" {...props} />,
    hr: (props) => <hr className="my-12 border-gray-300" {...props} />,
    table: (props) => <table className="table-auto border-collapse my-8" {...props} />,
    th: (props) => <th className="border px-6 py-4 bg-gray-100" {...props} />,
    td: (props) => <td className="border px-6 py-4" {...props} />,
  };

  const pageContent = (
    <div className="max-w-2xl mx-auto p-4">
      {loading && <div className="text-center">Loading...</div>}
      {!loading && notFound && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">404 - Blog Post Not Found</h1>
          <p>
            Sorry, no blog post found for{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{filename}</span>.
          </p>
        </div>
      )}
      {!loading && !notFound && (
        <div className="prose mx-auto my-8">
          {/* Removed SpeechControls from here since it's now fixed positioned */}
          {content.trimStart().toLowerCase().startsWith("<!doctype html>") &&
            (content.includes("You need to enable JavaScript to run this app.") ? (
              <div className="text-red-600 font-semibold my-8">Failed to display contents.</div>
            ) : (
              <iframe
                srcDoc={content}
                title="Blog HTML Content"
                className="w-full min-h-[500px] border rounded my-8"
                sandbox=""
              />
            ))}
          {!content.trimStart().toLowerCase().startsWith("<!doctype html>") && (
            <ReactMarkdown className="my-8 min-h-[600px]" components={markdownComponents}>
              {content}
            </ReactMarkdown>
          )}
        </div>
      )}
      {/* Add SpeechControls outside the content for the floating control */}
      {!loading &&
        !notFound &&
        !content.trimStart().toLowerCase().startsWith("<!doctype html>") && <SpeechControls />}
    </div>
  );

  return (
    <BaseLayout
      contentPadding={false}
      content={
        <div className="flex flex-col items-center mx-[1.5em] md:mx-[4em] my-[8em] py-8 sm:px-8 sm:py-12 md:px-16 md:py-20 lg:px-32 lg:py-24">
          <div className="mb-6 w-full flex justify-center">{BackToIndexButton}</div>
          {/* Show date posted if available */}
          {postMeta && postMeta.date && (
            <div className="mb-4 text-gray-500 dark:text-gray-400 text-sm font-DM_Mono text-center w-full">
              Posted: {formatBlogDate(postMeta.date)}
            </div>
          )}
          <div className="w-full flex justify-center">{pageContent}</div>
          {content && content.trim().length > 200 && (
            <div className="mt-[2em] mb-[10em] w-full flex justify-center">{BackToIndexButton}</div>
          )}
        </div>
      }
    />
  );
};

export default Blog;
