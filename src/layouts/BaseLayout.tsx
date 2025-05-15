import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignCollapseState } from "../store/reducers/sideNavigation/sideNavigationSlice";
import {
  selectIsSideNavigationCollapsed,
  selectKeepMenuOpen,
} from "../store/selectors/sidebarSelector";
import SideNavigation from "../components/Navigation/SideNavigation/SideNavigation";

interface Props {
  content: ReactNode;
  contentSnap?: boolean;
  contentPadding?: boolean;
  backgroundURL?: string;
  includeTopButton?: boolean;
}

export const BaseLayout = ({
  content,
  contentSnap = false,
  contentPadding = true,
  backgroundURL,
}: Props) => {
  const dispatch = useDispatch();
  const isSideNavigationCollapsed = useSelector(selectIsSideNavigationCollapsed);
  const keepMenuOpen = useSelector(selectKeepMenuOpen);

  const handleSideNavClick = () => {
    if (keepMenuOpen || !isSideNavigationCollapsed) return;
    dispatch(assignCollapseState(false));
  };

  const handleContentClick = () => {
    if (keepMenuOpen || isSideNavigationCollapsed) return;
    dispatch(assignCollapseState(true));
  };

  // Determine if the screen is mobile using a media query
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  return (
    <div className="flex flex-row h-screen">
      {/* Side Navigation Container */}
      <div
        style={{ transitionDuration: "0.25s" }}
        className={`transition-all cursor-pointer bg-blue-800 text-white overflow-auto z-10 shadow
          ${
            isSideNavigationCollapsed
              ? "w-[56px] min-w-[56px] max-w-[56px] h-fit overflow-clip m-2 rounded-lg absolute"
              : isMobile
                ? "fixed top-0 left-0 h-full w-[200px] min-w-[180px] max-w-[320px] md:w-[240px] lg:w-[280px] z-20"
                : "pt-2 pl-4 w-[240px] min-w-[180px] max-w-[320px] md:w-[240px] lg:w-[280px]"
          }
        `}
        onClick={handleSideNavClick}
      >
        <SideNavigation />
      </div>
      {/* Content Container */}
      <div
        className={`overflow-y-auto overflow-x-clip flex-1 min-w-0
          ${contentSnap ? "snap-y snap-mandatory" : ""}
          ${isMobile && !isSideNavigationCollapsed ? "pointer-events-none" : ""}
        `}
        onClick={handleContentClick}
      >
        <section
          style={{ backgroundImage: `url('${backgroundURL}')` }}
          className="flex bg-no-repeat bg-cover bg-center max-h-screen"
        >
          <div className="h-full">
            <div
              className={`min-w-full ${contentPadding ? "py-[64pt] px-8 md:px-10 lg:px-[12vw]" : ""}`}
              ref={(containerRef) => {
                if (containerRef && !isSideNavigationCollapsed && containerRef.offsetWidth < 768) {
                  containerRef.style.overflowX = "hidden";
                  containerRef.style.maxWidth = "100vw";
                } else if (containerRef) {
                  containerRef.style.overflowX = "";
                  containerRef.style.maxWidth = "";
                }
              }}
            >
              {content}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
