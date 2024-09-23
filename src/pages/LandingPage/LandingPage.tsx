import { Icon } from "@blueprintjs/core";
import { BaseLayout } from "../../layouts/BaseLayout";
import styles from "./LandingePage.module.css";

const LandingPage = () => {
  return (
    <BaseLayout
      contentSnap
      content={
        <div>
          <div className="h-screen w-full snap-always snap-start">
            <div className="pt-[20vh] h-screen">
              <h1 className="font-DM_Mono mb-4 text-5xl">hello,</h1>
              <div className="text-2xl">welcome to my page</div>
            </div>
            <span className="mt-[-20vh] text-blue-600 animate-bounce float-left flex flex-col">
              <span className="font-kalam ml-1">Go on, scroll!</span>
              <Icon className="ml-2" size={24} icon="chevron-down" />
            </span>
          </div>
          <div className="h-screen snap-always snap-start">
            <div className="pt-[20vh]">
              <h1 className="font-DM_Mono mb-4 text-5xl">whoami?</h1>
              <div className="text-xl">
                I'm someone who
                <span
                  className={
                    styles["cycling-text"] +
                    " bg-blue-700 text-white px-2 py-1 font-DM_Mono font-bold"
                  }
                />
              </div>
            </div>
          </div>
          <div className="h-screen snap-always snap-start">
            <div className="pt-[20vh]">It's pretty empty now. Updates will come in time.</div>
          </div>
        </div>
      }
    />
  );
};

export default LandingPage;
