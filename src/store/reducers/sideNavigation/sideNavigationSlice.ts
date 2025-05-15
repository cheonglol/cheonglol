// sample reducer
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isMobileDevice } from "../../../utils";

interface SideNavigationState {
  isSideNavigationCollapsed: boolean;
  keepMenuOpen: boolean;
  isDarkMode: boolean;
}

// Check for user's preferred color scheme
const prefersDarkMode =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialState: SideNavigationState = {
  isSideNavigationCollapsed: isMobileDevice(),
  keepMenuOpen: !isMobileDevice(),
  isDarkMode: prefersDarkMode,
};

const sideNavigationSlice = createSlice({
  name: "sideNavigation",
  initialState,
  reducers: {
    toggleCollapseState: (state) => {
      state.isSideNavigationCollapsed = !state.isSideNavigationCollapsed;
    },
    assignCollapseState: (state, action: PayloadAction<boolean>) => {
      state.isSideNavigationCollapsed = action.payload;
    },
    toggleKeepMenuOpenState: (state) => {
      state.keepMenuOpen = !state.keepMenuOpen;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const {
  assignCollapseState,
  toggleCollapseState,
  toggleKeepMenuOpenState,
  toggleDarkMode,
  setDarkMode,
} = sideNavigationSlice.actions;
export default sideNavigationSlice.reducer;
