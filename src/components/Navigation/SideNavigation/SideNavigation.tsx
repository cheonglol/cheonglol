import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../router/router";
import {
  assignCollapseState,
  toggleKeepMenuOpenState,
} from "../../../store/reducers/sideNavigation/sideNavigationSlice";
import {
  selectIsSideNavigationCollapsed,
  selectKeepMenuOpen,
} from "../../../store/selectors/sidebarSelector";
import { isMobileDevice } from "../../../helper";

const SideNavigation = () => {
  const ICON_SIZE = isMobileDevice() ? 22 : 16;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isSideNavigationCollapsed = useSelector(selectIsSideNavigationCollapsed);
  const keepMenuOpen = useSelector(selectKeepMenuOpen);

  const LinksFromRouter = () => {
    return routes.map((route) => {
      return (
        <Link
          className={`transition-all cursor-pointer p-3 m-1 mr-0 pr-0 outline-1 rounded-l-lg
          hover:outline-dashed hover:bg-blue-900 hover:text-blue-100
           ${location.pathname == route.routeObject.path ? "font-bold bg-white text-blue-900 text-3xl md:text-xl my-4 ml-4" : "text-white"}
          `}
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
    <div className="font-kalam text-xl sm:text-base h-fit">
      <Tooltip
        className="p-4 md:p-3"
        content={`${isSideNavigationCollapsed ? "Expand Menu" : "Collapse Menu"}`}
      >
        <Icon
          size={ICON_SIZE}
          icon={`${isSideNavigationCollapsed ? "chevron-right" : "chevron-left"}`}
          className="my-auto"
          onClick={() => {
            if (keepMenuOpen) dispatch(toggleKeepMenuOpenState());
            dispatch(assignCollapseState(true));
          }}
        />
      </Tooltip>
      <div className={`mt-5 flex ${isSideNavigationCollapsed ? "visible" : "hidden"}`}>
        {/* TODO: feature for collapsed menu icons? */}
        <Icon
          size={ICON_SIZE}
          icon="home"
          className="m-auto transition-all hover:scale-125 hover:text-blue-300"
          onClick={() => {
            dispatch(assignCollapseState(false));
            navigate(routes[0].routeObject.path as string);
          }}
        />
      </div>
      <div className={`mx-4 mr-0 ${isSideNavigationCollapsed ? "hidden" : "visible"}`}>
        {isMobileDevice() ? null : (
          <>
            <Checkbox
              className="mt-4 hidden md:visible"
              label="keep menu opened"
              checked={keepMenuOpen}
              onClick={() => {
                dispatch(toggleKeepMenuOpenState());
              }}
            />
            <hr />
          </>
        )}
        <div className="mt-4 flex flex-col truncate">{LinksFromRouter()}</div>
      </div>
    </div>
  );
};

export default SideNavigation;
