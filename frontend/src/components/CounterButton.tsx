import { useCounter, useIncrementCounter } from '../hooks/useCounter';

export default function CounterButton() {
  const { data, isLoading, error } = useCounter();
  const { mutate: increment, isPending } = useIncrementCounter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading counter</div>;

  return (
    <div className="counter">
      <p>Counter: {data?.value ?? 0}</p>
      <button onClick={() => increment()} disabled={isPending}>
        {isPending ? 'Incrementing...' : 'Increment'}
      </button>
    </div>
  );
}
