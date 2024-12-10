import { Avatar, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import {
  MdInventory,
  MdOutlineAdminPanelSettings,
  MdOutlineDashboard,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/features/sidebarSlice";
import { Link, useLocation } from "react-router-dom";

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const { user } = useSelector((state) => state.auth);
  const [stateOpenKeys, setStateOpenKeys] = useState([]);

  const permissions = user?.permission;

  const activeKey = pathname === "/" ? "/" : pathname.split("/")[1];
  let isSmallScreen = window.innerWidth <= 1000;

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

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
          key: "general-setup",
          label: "General Setup",
          disabled:
            !permissions?.company?.list &&
            !permissions?.company_branch?.list &&
            !permissions?.customer?.list &&
            !permissions?.supplier?.list,
          children: [
            {
              key: "company",
              label: <Link to="/company">Company</Link>,
              disabled: !permissions?.company?.list,
            },
            {
              key: "company-branch",
              label: <Link to="/company-branch">Company Branch</Link>,
              disabled: !permissions?.company_branch?.list,
            },
            {
              key: "customer",
              label: <Link to="/customer">Customer</Link>,
              disabled: !permissions?.customer?.list,
            },
            {
              key: "vendor",
              label: <Link to="/vendor">Vendor</Link>,
              disabled: !permissions?.supplier?.list,
            },
            {
              key: "flag",
              label: <Link to="/flag">Flag</Link>,
            },
            {
              key: "class",
              label: <Link to="/class">Class</Link>,
            },
            {
              key: "vessel",
              label: <Link to="/vessel">Vessel</Link>,
            },
            {
              key: "event",
              label: <Link to="/event">Event</Link>,
            },
          ],
        },
        {
          key: "user-management",
          label: "User Management",
          disabled:
            !permissions?.user?.list && !permissions?.user_permission?.list,
          children: [
            {
              key: "user",
              label: <Link to="/user">User</Link>,
              disabled: !permissions?.user?.list,
            },
            {
              key: "user-permission",
              label: <Link to="/user-permission">User Permission</Link>,
              disabled: !permissions.user_permission?.list,
            },
          ],
        },
      ],
    },
    {
      key: "inventory-management",
      label: "Inventory Management",
      icon: <MdInventory size={16} />,
      children: [
        {
          key: "inventory-setup",
          label: "Inventory Setup",
          children: [
            {
              key: "validity",
              label: <Link to="/validity">Validity</Link>,
            },
            {
              key: "payment",
              label: <Link to="/payment">Payment</Link>,
            },
          ],
        },
        {
          key: "sale-management",
          label: "Sale Management",
          children: [
            {
              key: "quotation",
              label: <Link to="/quotation">Quotation</Link>,
            },
          ],
        },
      ],
    },
  ];
  const levelKeys = getLevelKeys(items);

  return (
    <Layout.Sider
      collapsedWidth="0"
      theme="light"
      collapsed={isCollapsed}
      className={`${isSmallScreen ? "!fixed" : "!sticky"} ${
        isCollapsed ? "" : "border-r"
      } h-screen overflow-y-auto !left-0 !top-0 z-50 scrollbar`}
      width={240}
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
          <Avatar size={56} src={user.image_url} icon={<FaRegUser />} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {user.user_name}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
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
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
