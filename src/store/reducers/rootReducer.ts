import { combineReducers } from "@reduxjs/toolkit";
import sideNavigationReducer from "../reducers/sideNavigation/sideNavigationSlice";
// Remove this line if you're not using the new navigation reducer
// import navigationReducer from "../reducers/navigation/navigationSlice";

const rootReducer = combineReducers({
  sideNavigation: sideNavigationReducer,
  // Remove this line if you're not using the new navigation reducer
  // navigation: navigationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
