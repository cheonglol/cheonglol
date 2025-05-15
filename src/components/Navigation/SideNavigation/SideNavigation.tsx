import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { isMobileDevice } from "../../../utils";
import { routes } from "../../../router/router";
import {
  assignCollapseState,
  toggleKeepMenuOpenState,
} from "../../../store/reducers/sideNavigation/sideNavigationSlice";
import {
  selectIsSideNavigationCollapsed,
  selectKeepMenuOpen,
} from "../../../store/selectors/sidebarSelector";

const SideNavigation = () => {
  const ICON_SIZE = isMobileDevice() ? 20 : 18;
  const location = useLocation();
  const dispatch = useDispatch();
  const isSideNavigationCollapsed = useSelector(selectIsSideNavigationCollapsed);
  const keepMenuOpen = useSelector(selectKeepMenuOpen);

  const handleMenuIconClick = () => {
    if (keepMenuOpen) dispatch(toggleKeepMenuOpenState());
    dispatch(assignCollapseState(true));
  };

  const handleCheckboxClick = () => {
    dispatch(toggleKeepMenuOpenState());
  };

  return (
    <div className="font-kalam text-xl sm:text-base flex flex-col">
      <Tooltip
        className="flex"
        content={isSideNavigationCollapsed ? "Expand Menu" : "Collapse Menu"}
      >
        <Icon
          size={ICON_SIZE}
          icon={isSideNavigationCollapsed ? "menu-open" : "menu-closed"}
          className="my-auto p-4 md:p-3"
          onClick={handleMenuIconClick}
        />
      </Tooltip>
      <div className={`mx-4 mr-0 ${isSideNavigationCollapsed ? "hidden" : "visible"}`}>
        {!isMobileDevice() && (
          <div className="opacity-65">
            <Checkbox
              className="mt-4 hidden md:visible"
              label="keep menu opened"
              checked={keepMenuOpen}
              onClick={handleCheckboxClick}
            />
            <hr />
          </div>
        )}
        <div className="mt-4 flex flex-col truncate">
          {routes
            .filter((route) => !route.hidden)
            .map((route) => (
              <Link
                className={`transition-all cursor-pointer p-4 pb-3 m-1 mr-0 pr-0 outline-1 rounded-l-lg
                hover:outline-dashed hover:bg-blue-900 hover:text-blue-100
                ${location.pathname === route.routeObject.path ? "font-bold bg-white text-blue-900 text-2xl md:text-xl my-4 ml-4" : "text-white"}
              `}
                to={route.routeObject.path as string}
                key={route.title}
                onClick={() => {
                  document.title = `cheonglol - ${route.title}`;
                  if (!keepMenuOpen) dispatch(assignCollapseState(true));
                }}
              >
                {route.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
