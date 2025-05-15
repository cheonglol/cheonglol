import React from "react";
import SideNavigation from "../components/Navigation/SideNavigation/SideNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Fixed width container for SideNavigation */}
      <div className="flex-shrink-0 h-full z-10">
        <SideNavigation />
      </div>

      {/* Main content area with fixed dimensions */}
      <div className="flex-grow overflow-auto">{children}</div>
    </div>
  );
};

export default AppLayout;
