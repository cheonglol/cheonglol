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
            <div className="pt-[40vh] h-screen">
              <h1 className="font-DM_Mono mb-4 text-7xl">hello,</h1>
              <div className="text-3xl">welcome to my page</div>
            </div>
            <span className="mt-[-20vh] text-blue-600 animate-bounce flex flex-col content-center items-center">
              <span className="font-kalam">Go on, scroll!</span>
              <Icon size={22} icon="chevron-down" />
            </span>
          </div>
          <div className="h-screen snap-always snap-start">
            <div className="pt-[20vh]">
              <h1 className="font-DM_Mono mb-4 text-5xl">whoami?</h1>
              <div className="text-xl">
                I'm someone who{" "}
                <span
                  className={
                    styles["cycling-text"] +
                    " bg-blue-700 text-white px-2 py-1 font-DM_Mono font-bold mt-4 block w-fit rounded-lg"
                  }
                />
              </div>
            </div>
          </div>
          <div className="h-screen snap-always snap-start">
            <div className="text-xl pt-[40vh] font-kalam">
              It's pretty empty for now, but there will be updates soon.
            </div>
          </div>
        </div>
      }
    />
  );
};

export default LandingPage;
