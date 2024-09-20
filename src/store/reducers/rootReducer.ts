import { combineReducers } from "redux";
import sideNavigationReducer from "./sideNavigation/sideNavigationSlice";

const rootReducer = combineReducers({
  // Add reducers here
  sideNavigation: sideNavigationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
