import { Avatar, Layout, Menu, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import { LuClipboardList, LuPackage2 } from 'react-icons/lu';
import { MdOutlineAdminPanelSettings, MdOutlineDashboard } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/features/sidebarSlice';

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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const { user } = useSelector((state) => state.auth);
  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  const searchRef = useRef(null);

  const permissions = user?.permission;

  const activeKey = pathname === '/' ? '/' : pathname.split('/')[1];
  let isSmallScreen = window.innerWidth <= 1000;

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
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

  const generalGroupPermission =
    !permissions?.currency?.list &&
    !permissions?.company?.list &&
    !permissions?.company_branch?.list &&
    !permissions?.salesman?.list &&
    !permissions?.customer?.list &&
    !permissions?.supplier?.list &&
    !permissions?.agent?.list &&
    !permissions?.flag?.list &&
    !permissions?.class?.list &&
    !permissions?.port?.list &&
    !permissions?.vessel?.list &&
    !permissions?.event?.list;

  const userManagementPermission = !permissions?.user?.list && !permissions?.user_permission?.list;

  const inventorySetupPermission =
    !permissions?.category?.list &&
    !permissions?.sub_category?.list &&
    !permissions?.brand?.list &&
    !permissions?.warehouse?.list &&
    !permissions?.unit?.list &&
    !permissions?.product?.list &&
    !permissions?.validity?.list &&
    !permissions?.payment?.list;

  const purchaseManagementPermission =
    !permissions?.purchase_order?.list &&
    !permissions?.good_received_note?.list &&
    !permissions?.purchase_invoice?.list;

  const saleManagementPermission =
    !permissions?.quotation?.list &&
    !permissions?.charge_order?.list &&
    !permissions?.job_order?.list;

  const items = [
    {
      key: '/',
      icon: <MdOutlineDashboard size={18} />,
      label: <Link to="/">Dashboard</Link>
    },
    {
      key: 'administration',
      label: 'Administration',
      icon: <MdOutlineAdminPanelSettings size={18} />,
      disabled: generalGroupPermission && userManagementPermission,
      children: [
        {
          key: 'general-setup',
          label: 'General Setup',
          disabled: generalGroupPermission,
          children: [
            {
              key: 'currency',
              label: <Link to="/currency">Currency</Link>,
              disabled: !permissions?.currency?.list
            },
            {
              key: 'company',
              label: <Link to="/company">Company</Link>,
              disabled: !permissions?.company?.list
            },
            {
              key: 'company-branch',
              label: <Link to="/company-branch">Company Branch</Link>,
              disabled: !permissions?.company_branch?.list
            },
            {
              key: 'salesman',
              label: <Link to="/salesman">Salesman</Link>,
              disabled: !permissions?.salesman?.list
            },
            {
              key: 'customer',
              label: <Link to="/customer">Customer</Link>,
              disabled: !permissions?.customer?.list
            },
            {
              key: 'vendor',
              label: <Link to="/vendor">Vendor</Link>,
              disabled: !permissions?.supplier?.list
            },
            {
              key: 'agent',
              label: <Link to="/agent">Agent</Link>,
              disabled: !permissions?.agent?.list
            },
            {
              key: 'notes',
              label: <Link to="/notes">Notes</Link>,
              disabled: !permissions?.terms?.list
            },
            {
              key: 'flag',
              label: <Link to="/flag">Flag</Link>,
              disabled: !permissions?.flag?.list
            },
            {
              key: 'class',
              label: <Link to="/class">Class</Link>,
              disabled: !permissions?.class?.list
            },
            {
              key: 'port',
              label: <Link to="/port">Port</Link>,
              disabled: !permissions?.port?.list
            },
            {
              key: 'vessel',
              label: <Link to="/vessel">Vessel</Link>,
              disabled: !permissions?.vessel?.list
            },
            {
              key: 'event',
              label: <Link to="/event">Event</Link>,
              disabled: !permissions?.event?.list
            }
          ]
        },
        {
          key: 'user-management',
          label: 'User Management',
          disabled: userManagementPermission,
          children: [
            {
              key: 'user',
              label: <Link to="/user">User</Link>,
              disabled: !permissions?.user?.list
            },
            {
              key: 'user-permission',
              label: <Link to="/user-permission">User Permission</Link>,
              disabled: !permissions.user_permission?.list
            }
          ]
        }
      ]
    },
    {
      key: 'inventory-management',
      label: 'Inventory Management',
      icon: <LuPackage2 size={18} />,
      disabled: inventorySetupPermission && purchaseManagementPermission,
      children: [
        {
          key: 'inventory-setup',
          label: 'Inventory Setup',
          disabled: inventorySetupPermission,
          children: [
            {
              key: 'category',
              label: <Link to="/category">Category</Link>,
              disabled: !permissions?.category?.list
            },
            {
              key: 'sub-category',
              label: <Link to="/sub-category">Sub Category</Link>,
              disabled: !permissions?.sub_category?.list
            },
            {
              key: 'brand',
              label: <Link to="/brand">Brand</Link>,
              disabled: !permissions?.brand?.list
            },
            {
              key: 'warehouse',
              label: <Link to="/warehouse">Warehouse</Link>,
              disabled: !permissions?.warehouse?.list
            },
            {
              key: 'unit',
              label: <Link to="/unit">Unit</Link>,
              disabled: !permissions?.unit?.list
            },
            {
              key: 'product',
              label: <Link to="/product">Product</Link>,
              disabled: !permissions?.product?.list
            },
            {
              key: 'validity',
              label: <Link to="/validity">Validity</Link>,
              disabled: !permissions?.validity?.list
            },
            {
              key: 'payment',
              label: <Link to="/payment">Payment</Link>,
              disabled: !permissions?.payment?.list
            }
          ]
        },
        {
          key: 'purchase-management',
          label: 'Purchase Management',
          disabled: purchaseManagementPermission,
          children: [
            {
              key: 'purchase-order',
              label: <Link to="/purchase-order">Purchase Order</Link>,
              disabled: !permissions?.purchase_order?.list
            },
            {
              key: 'goods-received-note',
              label: <Link to="/goods-received-note">Goods Received Note</Link>,
              disabled: !permissions?.good_received_note?.list
            },
            {
              key: 'purchase-invoice',
              label: <Link to="/purchase-invoice">Purchase Invoice</Link>,
              disabled: !permissions?.purchase_invoice?.list
            }
          ]
        }
      ]
    },
    {
      key: 'sale-management',
      label: 'Sale Management',
      icon: <LuClipboardList size={18} />,
      disabled: saleManagementPermission,
      children: [
        {
          key: 'quotation',
          label: <Link to="/quotation">Quotation</Link>,
          disabled: !permissions?.quotation?.list
        },
        {
          key: 'charge-order',
          label: <Link to="/charge-order">Charge Order</Link>,
          disabled: !permissions?.charge_order?.list
        },
        {
          key: 'pick-list',
          label: <Link to="/pick-list">Pick List</Link>
        },
        {
          key: 'ijo',
          disabled: !permissions?.job_order?.list,
          label: <Link to="/ijo">IJO</Link>
        }
      ]
    }
  ];
  const levelKeys = getLevelKeys(items);

  function getEnabledLeafLabelsAndKeys(items) {
    const result = [];

    function traverse(items) {
      items.forEach((item) => {
        if (!item.disabled) {
          if (item.children && item.children.length > 0) {
            // Traverse deeper into children
            traverse(item.children);
          } else {
            // Add leaf nodes (last children)
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
        searchRef.current?.focus(); // Focus on the search box
      }
    };

    // Attach event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleShortcut);

    // Cleanup event listeners on component unmount
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
      className={`${isSmallScreen ? '!fixed' : '!sticky'} ${
        isCollapsed ? '' : 'border-r'
      } scrollbar !left-0 !top-0 z-50 h-screen overflow-y-auto`}
      width={240}>
      <div className="m-2 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-200 p-4 px-2">
        {isSmallScreen && (
          <div
            className="absolute right-5 top-5 cursor-pointer rounded border bg-white p-1 hover:bg-gray-50"
            onClick={() => dispatch(toggleSidebar())}>
            <BiChevronLeft size={18} />
          </div>
        )}
        <div>
          <Avatar size={56} src={user.image_url} icon={<FaRegUser />} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">{user.user_name}</p>
          <p className="text-xs">{user.email}</p>
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
          options={getEnabledLeafLabelsAndKeys(items)}
          onChange={(selectedKey) => {
            if (selectedKey) {
              const parentKeys = getParentKeys(selectedKey, items);
              setStateOpenKeys(parentKeys); // Open the relevant menu sections
              navigate(selectedKey); // Navigate to the selected page
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
        items={items}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
      />
    </Layout.Sider>
  );
};

export default Sidebar;
