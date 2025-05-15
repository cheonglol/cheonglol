import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isMobileDevice } from "../../../utils";

interface NavigationState {
  isCollapsed: boolean;
}

const initialState: NavigationState = {
  isCollapsed: isMobileDevice(),
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleNavigation: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setNavigationState: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
  },
});

export const { toggleNavigation, setNavigationState } = navigationSlice.actions;
export default navigationSlice.reducer;
