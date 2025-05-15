import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducers/rootReducer";
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./router/router";

function App() {
  const isDarkMode = useSelector((state: RootState) => state.sideNavigation.isDarkMode);

  // Apply dark mode class to the document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
