import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BaseLayout } from "../../layouts/BaseLayout";
import { assignCollapseState } from "../../store/reducers/sideNavigation/sideNavigationSlice";
import LandingIntro from "./components/LandingIntro";
import LandingWhoAmI from "./components/LandingWhoAmI";

const LandingPage = () => {
  const dispatchRedux = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      dispatchRedux(assignCollapseState(false));
    }
  }, []);

  return (
    <BaseLayout
      contentSnap
      content={
        <div>
          <LandingIntro />
          <LandingWhoAmI />
        </div>
      }
    />
  );
};

export default LandingPage;
