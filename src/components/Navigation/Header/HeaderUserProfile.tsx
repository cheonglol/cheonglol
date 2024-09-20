import { Icon } from "@blueprintjs/core";

interface Props {
  profileImgSrc?: string;
}

const HeaderUserProfile = ({ profileImgSrc }: Props) => {
  const size = 30;
  const placeholderIcon = (
    <Icon icon="user" size={size} className="fill-current text-gray-500 mt-1" />
  );
  return (
    <div data-testid="header-user-profile" className="w-[165px] flex flex-row text-left mx-4">
      <div className="mx-2">
        {profileImgSrc ? (
          <img
            src={profileImgSrc}
            className={`object-cover object-center rounded-full h-[${size}px] w-[${size}px] mt-1`}
            alt="profile-picture"
          />
        ) : (
          placeholderIcon
        )}
      </div>
      <div className="truncate flex flex-col justify-center">
        <span className="truncate m-0 opacity-65">Welcome</span>
        <span className="truncate m-0 font-semibold">John Doe</span>
      </div>
    </div>
  );
};

export default HeaderUserProfile;
