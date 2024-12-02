import { Avatar, Dropdown } from "antd";
import { FaRegUser } from "react-icons/fa";
import { MdLockOutline, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-2" onClick={handleLogout}>
      <MdLogout size={16} />
      <span>Logout</span>
    </div>
  );
};

const ChangePassword = () => {
  return (
    <>
      <div className="flex items-center gap-2">
        <MdLockOutline size={16} />
        <span>Update Password</span>
      </div>
    </>
  );
};

const ProfileMenu = () => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: <ChangePassword />,
          },
          {
            key: "2",
            danger: true,
            label: <Logout />,
          },
        ],
      }}
      arrow
    >
      <Avatar icon={<FaRegUser />} size={40} />
    </Dropdown>
  );
};

export default ProfileMenu;
