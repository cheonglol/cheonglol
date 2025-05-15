import { Icon } from "@blueprintjs/core";

const LandingIntro = () => (
  <div className="h-screen w-full snap-always snap-start">
    <div className="pt-[40vh] h-screen">
      <h1 className="font-DM_Mono mb-4 text-7xl">hello,</h1>
      <div className="text-3xl">welcome to my page</div>
    </div>
    <span className="mt-[-20vh] text-blue-600 animate-bounce flex flex-col">
      <span className="font-kalam">
        Go on, scroll!
        <Icon className="inline-block" size={22} icon="caret-down" />
      </span>
    </span>
  </div>
);

export default LandingIntro;
