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
