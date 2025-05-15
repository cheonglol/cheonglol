export const isMobileDevice = (): boolean => {
  const value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    navigator.maxTouchPoints > 0;
  // if (value) {
  //   alert("User is on a mobile device");
  //   // Add your mobile-specific logic here
  // } else {
  //   alert("User is on a desktop/laptop");
  //   // Add your desktop-specific logic here
  // }
  return value;
};

// Shuffle utility
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
