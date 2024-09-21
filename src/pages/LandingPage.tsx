import { Icon } from "@blueprintjs/core";
import { BaseLayout } from "../layouts/BaseLayout";

const LandingPage = () => {
  return (
    <BaseLayout
      contentSnap
      content={
        <>
          <div className="h-screen snap-always snap-start">
            <div className="pt-[20vh] h-screen">
              <h1 className="font-DM_Mono mb-4 text-5xl">hello,</h1>
              <div className="text-2xl">welcome to my page</div>
            </div>
            <span className="mt-[-20vh] text-blue-600 animate-bounce float-left flex flex-row">
              <Icon className="" size={24} icon="chevron-down" />
            </span>
          </div>
          <div className="overflow-clip h-screen snap-always snap-start">
            <div className="pt-[20vh]">
              <h1 className="font-DM_Mono mb-4 text-5xl">whoami?</h1>
              <div className="text-2xl">someone who </div>
            </div>
          </div>
        </>
      }
    />
  );
};

export default LandingPage;
