import { createBrowserRouter, RouteObject } from "react-router-dom";
import ProtectedRoute from "./logic/ProtectedRouteLogic";
import ErrorBoundaryPage from "../pages/ErrorBoundaryPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import { ReactElement } from "react";
import Blog from "../pages/Blog";
import Projects from "../pages/Projects";

const ROOT_PATH = "/cheonglol";

enum ROUTE_LOGIC_TYPE {
  AUTH_CHECK = "AUTH_CHECK",
}

export interface ExtendedRouteObject {
  title: string;
  logicType: ROUTE_LOGIC_TYPE | undefined;
  routeObject: RouteObject;
  category?: string;
}

export const routes: ExtendedRouteObject[] = [
  {
    title: "Home",
    logicType: undefined,
    routeObject: {
      path: `${ROOT_PATH}/`,
      element: <LandingPage />,
      errorElement: <ErrorBoundaryPage />, // Applies to all
    },
  },
  {
    title: "Blog",
    logicType: undefined,
    routeObject: {
      path: `${ROOT_PATH}/blog`,
      element: <Blog />,
      errorElement: <ErrorBoundaryPage />, // Applies to all
    },
  },
  {
    title: "Projects",
    logicType: undefined,
    routeObject: {
      path: `${ROOT_PATH}/thoughts`,
      element: <Projects />,
      errorElement: <ErrorBoundaryPage />, // Applies to all
    },
  },
];

const applyRouteLogic = (route: ExtendedRouteObject) => {
  switch (route.logicType) {
    case ROUTE_LOGIC_TYPE.AUTH_CHECK:
      return {
        ...route.routeObject,
        element: <ProtectedRoute>{route.routeObject.element as ReactElement}</ProtectedRoute>,
      };

    default:
      break;
  }
  return route.routeObject;
};

export const browserRouter = createBrowserRouter(routes.map(applyRouteLogic));
