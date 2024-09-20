// sample reducer
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SideNavigationState {
  isSideNavigationCollapsed: boolean;
  keepMenuOpen: boolean;
}

const initialState: SideNavigationState = {
  isSideNavigationCollapsed: true,
  keepMenuOpen: false,
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
  },
});

export const { assignCollapseState, toggleCollapseState, toggleKeepMenuOpenState } =
  sideNavigationSlice.actions;
export default sideNavigationSlice.reducer;
