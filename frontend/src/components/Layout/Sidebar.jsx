import { Avatar, Layout, Menu } from "antd";
import { useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineDashboard,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/features/sidebarSlice";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isCollapsed } = useSelector((state) => state.sidebar);

  const activeKey = pathname === "/" ? "/" : pathname.split("/")[1];
  let isSmallScreen = window.innerWidth <= 1000;

  useEffect(() => {
    const handleResize = () => {
      isSmallScreen = window.innerWidth <= 1000;
      dispatch(toggleSidebar(isSmallScreen));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      key: "/",
      icon: <MdOutlineDashboard size={18} />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "administration",
      label: "Administration",
      icon: <MdOutlineAdminPanelSettings size={18} />,
      children: [
        {
          key: "user",
          label: <Link to="/user">User</Link>,
        },
        {
          key: "user-permission",
          label: <Link to="/user-permission">User Permission</Link>,
        },
      ],
    },
  ];

  return (
    <Layout.Sider
      collapsedWidth="0"
      theme="light"
      collapsed={isCollapsed}
      className={`${isSmallScreen ? "!fixed" : "!sticky"} ${
        isCollapsed ? "" : "border-r"
      } h-screen overflow-y-auto !left-0 !top-0 z-50 scrollbar`}
      width={230}
    >
      <div className="p-4 px-2 flex flex-col justify-center items-center gap-2 bg-zinc-100 m-2 rounded-2xl">
        {isSmallScreen && (
          <div
            className="absolute top-5 right-5 border hover:bg-gray-50 cursor-pointer bg-white p-1 rounded"
            onClick={() => dispatch(toggleSidebar())}
          >
            <BiChevronLeft size={18} />
          </div>
        )}
        <div>
          <Avatar size={56} icon={<FaRegUser />} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">User Name</p>
          <p className="text-xs text-gray-500">useremail@gmail.com</p>
        </div>
      </div>
      <Menu
        className="!border-none"
        selectedKeys={[activeKey]}
        onClick={() => {
          isSmallScreen && dispatch(toggleSidebar());
        }}
        mode="inline"
        items={items}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
