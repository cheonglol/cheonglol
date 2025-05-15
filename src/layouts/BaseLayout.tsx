import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers/rootReducer";
import SideNavigation from "../components/Navigation/SideNavigation/SideNavigation";
import { Icon } from "@blueprintjs/core";
import { toggleCollapseState } from "../store/reducers/sideNavigation/sideNavigationSlice";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  content: ReactNode;
  contentSnap?: boolean;
  contentPadding?: boolean;
  backgroundURL?: string;
}

export const BaseLayout = ({
  content,
  contentSnap = false,
  contentPadding = true,
  backgroundURL,
}: Props) => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.sideNavigation.isSideNavigationCollapsed
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track window resize to determine if we're in mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Side Navigation - Only allocate space in layout for desktop */}
      {!isMobile && (
        <div
          className={`
          h-full bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
        `}
        >
          <SideNavigation />
        </div>
      )}

      {/* Main Content - Full width on mobile */}
      <div
        className={`flex-grow h-full overflow-auto ${contentSnap ? "snap-y snap-mandatory" : ""} ${contentPadding ? "p-4" : ""}`}
        style={{
          backgroundImage: backgroundURL ? `url(${backgroundURL})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onClick={() => {
          if (!isCollapsed) {
            dispatch({ type: "TOGGLE_SIDE_NAVIGATION" });
          }
        }}
      >
        <div className="h-full">{content}</div>
      </div>

      {/* Mobile Menu Button - Only shown when menu is collapsed */}
      <AnimatePresence>
        {isMobile && isCollapsed && (
          <motion.button
            className="fixed top-4 left-4 z-30 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
            onClick={() => dispatch(toggleCollapseState())}
            aria-label="Open menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon icon="menu-open" size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Render navigation as a standalone component for mobile */}
      {isMobile && <SideNavigation />}
    </div>
  );
};
