import AppIcon from "./AppIcon";

const Header = () => {
  // const handleLogout = () => {
  //   const navigate = useNavigate();
  //   localStorage.setItem("user", "");
  //   navigate("/login");
  // };

  return (
    <div className="transition-all p-4 border-b min-h-[50pt] lg:min-h-[65pt]">
      <div className="flex flex-row space-x-2 w-full justify-between">
        <AppIcon className="my-auto block" />
        {/* <div className="flex space-x-2">
          <AppIcon className="h-2" />
        </div> */}
        {/* <div className="flex content-center space-x-2">
            <HeaderUserProfile />
            <Button icon="notifications" className="float-right" minimal={true} />
            <Button
            icon="drawer-left"
            className="float-right"
            minimal={true}
            onClick={() => handleLogout()}
            />
          </div> */}
      </div>
    </div>
  );
};

export default Header;
