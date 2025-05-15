export const isMobileDevice = (): boolean => {
  const value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    navigator.maxTouchPoints > 0;
  return value;
};

// Shuffle utility - Fisher-Yates algorithm - https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
