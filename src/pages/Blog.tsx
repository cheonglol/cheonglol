import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const { filename } = useParams<{ filename: string }>();
  const [content, setContent] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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

  let pageContent;
  if (loading) {
    pageContent = (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div>Loading...</div>
      </div>
    );
  } else if (notFound) {
    pageContent = (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">404 - Blog Post Not Found</h1>
        <p>
          Sorry, no blog post found for{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{filename}</span>.
        </p>
      </div>
    );
  } else {
    pageContent = (
      <div className="prose mx-auto p-4 my-8">
        <div className="mb-6">{BackToIndexButton}</div>
        {content.trimStart().toLowerCase().startsWith("<!doctype html>") ? (
          content.includes("You need to enable JavaScript to run this app.") ? (
            <div className="text-red-600 font-semibold my-8">Failed to display contents.</div>
          ) : (
            <iframe
              srcDoc={content}
              title="Blog HTML Content"
              className="w-full min-h-[500px] border rounded my-8"
              sandbox=""
            />
          )
        ) : (
          <ReactMarkdown className="my-8 min-h-[600px]">{content}</ReactMarkdown>
        )}
        {content.trim().length > 200 && <div className="mt-8">{BackToIndexButton}</div>}
      </div>
    );
  }

  return <BaseLayout content={pageContent} />;
};

export default Blog;
