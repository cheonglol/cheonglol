import { useState, useEffect } from "react";

type DocFile = {
  slug: string;
  title: string;
  date: string;
  description: string;
  categories: string[];
  content: string;
};

type DocFolder = {
  name: string;
  label: string;
  docs: DocFile[];
};

type Props = {
  folders: DocFolder[];
};

function DocModal({
  doc,
  onClose,
}: {
  doc: DocFile | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (doc) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [doc, onClose]);

  if (!doc) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <article>
          <h2>{doc.title}</h2>
          <p className="text-muted">{doc.date}</p>
          <div className="modal-tags">
            {doc.categories.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div
            className="modal-body"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </article>
      </div>
    </div>
  );
}

function FolderView({
  folder,
  onSelectDoc,
}: {
  folder: DocFolder;
  onSelectDoc: (doc: DocFile) => void;
}) {
  return (
    <div className="docs-folder-contents">
      {folder.docs.length === 0 ? (
        <p className="text-muted">No documents yet.</p>
      ) : (
        <div className="posts-list">
          {folder.docs.map((doc) => (
            <article
              key={doc.slug}
              className="card post-card"
              onClick={() => onSelectDoc(doc)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectDoc(doc)}
            >
              <h3>{doc.title}</h3>
              <p className="text-muted">{doc.date}</p>
              <p>{doc.description}</p>
              {doc.categories.length > 0 && (
                <div className="tags" style={{ marginTop: "0.5rem" }}>
                  {doc.categories.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function DocExplorer({ folders }: Props) {
  const [activeFolder, setActiveFolder] = useState<string | null>(
    folders.length === 1 ? folders[0].name : null,
  );
  const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(null);

  const currentFolder = folders.find((f) => f.name === activeFolder) ?? null;

  return (
    <>
      <div className="docs-explorer">
        <div className="docs-folders">
          {folders.map((folder) => (
            <button
              key={folder.name}
              className={`docs-folder-btn${
                activeFolder === folder.name ? " active" : ""
              }`}
              onClick={() =>
                setActiveFolder(
                  activeFolder === folder.name ? null : folder.name,
                )
              }
            >
              <span className="folder-icon">
                {activeFolder === folder.name ? "📂" : "📁"}
              </span>
              <span className="folder-name">{folder.label}</span>
              <span className="folder-count">{folder.docs.length}</span>
            </button>
          ))}
        </div>

        {currentFolder && (
          <FolderView folder={currentFolder} onSelectDoc={setSelectedDoc} />
        )}
      </div>

      <DocModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </>
  );
}
