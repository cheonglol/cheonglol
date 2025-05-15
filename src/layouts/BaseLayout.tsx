import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers/rootReducer";
import SideNavigation from "../components/Navigation/SideNavigation/SideNavigation";

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

  return (
    <div className="flex flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Side Navigation */}
      <div
        className={`
        h-full bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
      `}
      >
        <SideNavigation />
      </div>

      {/* Main Content */}
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
    </div>
  );
};
