// Local, type-only copy of the Post shape used by the frontend until the
// backend contract is published as a shared package. Keep in sync with
// `backend/src/orpc/contract.ts`.
export type Post = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  /** label-style categories/tags */
  categories?: string[] | null;
  content: string;
  publishedAt: string | null;
};
