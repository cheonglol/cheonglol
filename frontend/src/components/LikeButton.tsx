import { useLikes, useLikeMutation } from "../hooks/usePosts";

type Props = {
  slug: string;
};

export function LikeButton({ slug }: Props) {
  const { data, isLoading } = useLikes(slug);
  const mutation = useLikeMutation(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutation.mutate();
  };

  return (
    <button
      className="like-btn"
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-label="Like this post"
    >
      <span className="like-emoji">💖</span>
      <span className="like-count">{isLoading ? "..." : data?.count ?? 0}</span>
    </button>
  );
}
