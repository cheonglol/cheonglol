import { Link } from "react-router-dom";

interface Props {
  className?: string;
}

const AppIcon = ({ className }: Props) => {
  return (
    <Link to="/" className={className}>
      <h2>cheonglol</h2>
      {/* <img className="block m-auto h-fit" src="/logo192.png" alt="logo" /> */}
    </Link>
  );
};

export default AppIcon;
