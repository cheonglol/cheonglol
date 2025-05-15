import { Icon, IconName } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { routes } from "../../../router/router";
import { RootState } from "../../../store/reducers/rootReducer";
import { toggleCollapseState } from "../../../store/reducers/sideNavigation/sideNavigationSlice";
import { useMemo, useEffect, useState } from "react";

// Function to map route titles to appropriate Blueprint icons
const getIconForRoute = (routeTitle: string): IconName => {
  const iconMap: Record<string, IconName> = {
    Home: "home",
    Blog: "document",
    Projects: "projects",
    About: "user",
    Contact: "envelope",
    // Add more mappings as needed
  };

  return iconMap[routeTitle] || "dot";
};

const SideNavigation = () => {
  const location = useLocation();
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

  const sideNavVariants = {
    expanded: {
      x: 0,
      width: isMobile ? "240px" : "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    collapsed: {
      x: isMobile ? "-100%" : 0,
      width: isMobile ? "240px" : "60px",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Memoize the header component
  const header = useMemo(
    () => (
      <div className="p-3 sm:p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1
              className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 font-DM_Mono truncate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              cheonglol
            </motion.h1>
          )}
        </AnimatePresence>
        <button
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          onClick={() => dispatch(toggleCollapseState())}
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          <Icon icon={isCollapsed ? "menu-open" : "menu-closed"} size={16} />
        </button>
      </div>
    ),
    [isCollapsed, dispatch]
  );

  // Memoize the navigation links
  const navigationLinks = useMemo(
    () => (
      <ul className="space-y-0.5 sm:space-y-1">
        {routes
          .filter((route) => !route.hidden)
          .map((route) => {
            const isActive = location.pathname === route.routeObject.path;
            const routeIcon = getIconForRoute(route.title);

            return (
              <li key={route.title}>
                <Link
                  to={route.routeObject.path as string}
                  className={`
                  flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-300-custom text-white dark:bg-blue-300-custom dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-300-custom dark:hover:bg-blue-300-custom"
                  }
                `}
                  onClick={() => {
                    document.title = `cheonglol - ${route.title}`;
                    if (isMobile && !isCollapsed) {
                      dispatch(toggleCollapseState());
                    }
                  }}
                >
                  <Icon icon={routeIcon} size={16} className={isCollapsed ? "mx-auto" : "mr-3"} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {route.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
      </ul>
    ),
    [location.pathname, isCollapsed]
  );

  // Memoize the footer
  const footer = useMemo(
    () => (
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-DM_Mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <p>© 2023 cheonglol</p>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    [isCollapsed]
  );

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isMobile && !isCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(toggleCollapseState())}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`flex flex-col h-full ${
          isMobile ? "fixed top-0 left-0 z-20 bg-white dark:bg-gray-800 shadow-lg" : "relative"
        }`}
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sideNavVariants}
      >
        {/* Header with toggle button */}
        {header}

        {/* Navigation links */}
        <nav className="mt-2 sm:mt-4 flex-1 overflow-y-auto">{navigationLinks}</nav>

        {/* Footer area */}
        {footer}
      </motion.div>
    </>
  );
};

export default SideNavigation;
