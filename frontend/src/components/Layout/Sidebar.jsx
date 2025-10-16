import { Avatar, Layout, Menu, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { FaBox } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import { IoMdGrid } from 'react-icons/io';
import { FaTrademark } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import { MdOutlineDashboard } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/features/sidebarSlice';
import image_url from '../../assets/user-placeholder.jpg'

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

function sortChildren(items) {
  return items.map(item => {
    if (item.children && item.children.length > 0) {
      const sortedChildren = [...item.children].sort((a, b) => {
        const labelA = typeof a.label === 'string'
          ? a.label
          : a.label?.props?.children?.toString() || '';
        const labelB = typeof b.label === 'string'
          ? b.label
          : b.label?.props?.children?.toString() || '';
        return labelA.localeCompare(labelB);
      });

      return {
        ...item,
        children: sortChildren(sortedChildren),
      };
    }
    return item;
  });
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const [user , setUser] = useState({
    email: "admin@dasthakat.com",
    user_name: "Dasthakat",
    image_url: image_url
    
  })
  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  const searchRef = useRef(null);

  const activeKey = pathname === '/' ? '/' : pathname.split('/')[1];
  let isSmallScreen = window.innerWidth <= 1000;

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };
  const items = [
    {
      key: '/',
      icon: <MdOutlineDashboard size={18} />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: 'user',
      icon: <FaUserAlt size={18} />,
      label: <Link to="/user">User</Link>,
    },
    {
      key: 'category',
      icon: <IoMdGrid size={18} />,
      label: <Link to="/category">Category</Link>,
    },
    {
      key: 'brand',
       icon: <FaTrademark size={18} />,
      label: <Link to="/brand">Brand</Link>,
    },
    {
      key: 'product',
      icon: <MdOutlineShoppingCart size={18} />,
      label: <Link to="/product">Product</Link>,
    },
    {
      key: 'orders',
      icon: <FaBox size={18} />,
      label: <Link to="/orders">Orders</Link>,
    },
  ];
  const sortedItems = sortChildren(items);
  const levelKeys = getLevelKeys(sortedItems);

  function getEnabledLeafLabelsAndKeys(items) {
    const result = [];

    function traverse(items) {
      items.forEach((item) => {
        if (!item.disabled) {
          if (item.children && item.children.length > 0) {
            traverse(item.children);
          } else {
            const label = typeof item.label === 'string' ? item.label : item.label?.props?.children;
            if (label && item.key) {
              result.push({ label, value: item.key });
            }
          }
        }
      });
    }

    traverse(items);
    return result;
  }

  const getParentKeys = (key, items) => {
    let parentKeys = [];

    const findPath = (items, currentPath = []) => {
      for (const item of items) {
        const newPath = [...currentPath, item.key];
        if (item.key === key) {
          parentKeys = currentPath;
          return true;
        }
        if (item.children && findPath(item.children, newPath)) {
          return true;
        }
      }
      return false;
    };

    findPath(items);
    return parentKeys;
  };

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 1000;
      dispatch(toggleSidebar(isSmallScreen));
    };

    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        if (isCollapsed) dispatch(toggleSidebar(false));
        searchRef.current?.focus();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleShortcut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Layout.Sider
      collapsedWidth="0"
      theme="light"
      collapsed={isCollapsed}
      className={`${isSmallScreen ? '!fixed' : '!sticky'} ${isCollapsed ? '' : 'border-r'
        } scrollbar !left-0 !top-0 z-50 h-screen overflow-y-auto`}
      width={250}>
      <div className="m-2 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-200 p-4 px-2">
        {isSmallScreen && (
          <div
            className="absolute right-5 top-5 cursor-pointer rounded border bg-white p-1 hover:bg-gray-50"
            onClick={() => dispatch(toggleSidebar())}>
            <BiChevronLeft size={18} />
          </div>
        )}
        <div>
          <Avatar size={56} src={user?.image_url} icon={<FaRegUser />} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">{user?.user_name}</p>
          <p className="text-xs">{user?.email}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Select
          ref={searchRef}
          showSearch
          allowClear
          notFoundContent={null}
          value={null}
          optionFilterProp="label"
          options={getEnabledLeafLabelsAndKeys(sortedItems)}
          onChange={(selectedKey) => {
            if (selectedKey) {
              const parentKeys = getParentKeys(selectedKey, items);
              setStateOpenKeys(parentKeys);
              navigate(selectedKey);
              if (isSmallScreen) dispatch(toggleSidebar(true));
            }
          }}
          placeholder="Search (Ctrl + K)"
          className="mx-1 w-full"
          suffixIcon={<IoSearchSharp size={16} />}
          optionRender={(value) => (
            <div className="flex items-center gap-2">
              <IoIosArrowRoundForward className="text-primary" size={20} />
              <span>{value.label}</span>
            </div>
          )}
        />
      </div>
      <Menu
        className="!border-none"
        selectedKeys={[activeKey]}
        onClick={() => {
          isSmallScreen && dispatch(toggleSidebar());
        }}
        mode="inline"
        items={sortedItems}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
      />
    </Layout.Sider>
  );
};

export default Sidebar;