import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import {
  assignCollapseState,
  toggleKeepMenuOpenState,
} from "../../../store/reducers/sideNavigation/sideNavigationSlice";
import {
  selectIsSideNavigationCollapsed,
  selectKeepMenuOpen,
} from "../../../store/selectors/sidebarSelector";
import { routes } from "../../../router/router";
import { Link } from "react-router-dom";

const SideNavigation = () => {
  const dispatch = useDispatch();
  const isSideNavigationCollapsed = useSelector(selectIsSideNavigationCollapsed);
  const keepMenuOpen = useSelector(selectKeepMenuOpen);

  const LinksFromRouter = () => {
    return routes.map((route) => {
      return (
        <Link
          className={`transition-all cursor-pointer py-2 hover:font-bold ${location.pathname == route.routeObject.path ? "text-blue-200 font-bold" : "text-gray-300"}`}
          to={route.routeObject.path as string}
          key={route.title}
          onClick={() => {
            document.title = `cheonglol - ${route.title}`;
          }}
        >
          {route.title}
        </Link>
      );
    });
  };

  return (
    <>
      <Tooltip
        className="p-3 my-auto"
        content={`${isSideNavigationCollapsed ? "Expand Menu" : "Collapse Menu"}`}
      >
        <Icon
          size={16}
          className="my-auto"
          icon={`${isSideNavigationCollapsed ? "chevron-right" : "chevron-left"}`}
          onClick={() => {
            if (keepMenuOpen) dispatch(toggleKeepMenuOpenState());
            dispatch(assignCollapseState(true));
          }}
        />
      </Tooltip>
      <div className={`mx-4 animate-[fade-in] ${isSideNavigationCollapsed ? "hidden" : "block"}`}>
        <Checkbox
          className="mt-4"
          label="keep menu opened"
          checked={keepMenuOpen}
          onClick={() => {
            dispatch(toggleKeepMenuOpenState());
          }}
        />
        <hr />
        <div className="mt-4 flex flex-col truncate">{LinksFromRouter()}</div>
      </div>
    </>
  );
};

export default SideNavigation;
