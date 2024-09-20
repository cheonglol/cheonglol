import { RootState } from "../reducers/rootReducer";

export const selectIsSideNavigationCollapsed = (state: RootState) =>
  state.sideNavigation.isSideNavigationCollapsed;

export const selectKeepMenuOpen = (state: RootState) => state.sideNavigation.keepMenuOpen;
