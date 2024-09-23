import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignCollapseState,
  // toggleCollapseState,
} from "../store/reducers/sideNavigation/sideNavigationSlice";
import {
  selectIsSideNavigationCollapsed,
  selectKeepMenuOpen,
} from "../store/selectors/sidebarSelector";
import SideNavigation from "../components/Navigation/SideNavigation/SideNavigation";
// import Header from "../components/Header/Header";

interface Props {
  // headerContent?: ReactNode;
  content: ReactNode;
  contentSnap?: boolean; // applies `snap-y snap-mandatory` to content container
  contentPadding?: boolean;
  // footerContent?: ReactNode;
  // deadCenterChildDOM?: boolean;
  backgroundURL?: string;
  includeTopButton?: boolean;
}

// export const BaseLayout = ({ headerContent, mainContent, footerContent, backgroundURL }: Props) => {
export const BaseLayout = ({
  content,
  contentSnap,
  contentPadding = true,
  backgroundURL,
}: Props) => {
  const dispatch = useDispatch();

  const isSideNavigationCollapsed = useSelector(selectIsSideNavigationCollapsed);
  const keepMenuOpen = useSelector(selectKeepMenuOpen);
  return (
    <>
      {/* <section className="min-h-[5vh]">{!headerContent ? <Header /> : headerContent}</section> */}
      <div className="flex flex-row h-screen">
        {/* Side Navigation Container */}
        <div
          style={{ transitionDuration: "0.25s" }}
          className={`transition-all cursor-pointer bg-blue-800 text-white overflow-auto z-10 shadow
          ${isSideNavigationCollapsed ? "flex-[0] min-w-fit h-fit overflow-clip m-2 rounded-lg absolute" : "pt-2 pl-4 flex-[0.75] md:flex-[0.25] lg:flex-[0.20]"}
          `}
          onClick={() => {
            if (keepMenuOpen || !isSideNavigationCollapsed) return;
            dispatch(assignCollapseState(false));
          }}
        >
          <SideNavigation />
        </div>
        {/* Content Container */}
        <div
          className={`overflow-y-auto overflow-x-clip 
          ${isSideNavigationCollapsed ? "flex-[1]" : "flex-[0.25] md:flex-[0.75] lg:flex-[0.80]"}
          ${contentSnap ? "snap-y snap-mandatory" : ""}
          `}
          onClick={() => {
            if (keepMenuOpen) return;
            dispatch(assignCollapseState(true));
          }}
        >
          <section
            style={{ backgroundImage: `url('${backgroundURL}')` }}
            className={`flex bg-no-repeat bg-cover bg-center max-h-screen`}
          >
            <div className="h-full">
              {
                <div
                  className={`min-w-full ${contentPadding ? "py-[64pt] px-8 md:px-10 lg:px-[12vw]" : ""}`}
                >
                  {content}
                </div>
              }
            </div>
          </section>
        </div>
      </div>
      {/* {!footerContent ? <></> : <section className="min-h-[5vh]">{footerContent}</section>} */}
    </>
  );
};
