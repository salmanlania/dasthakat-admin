import { Avatar, Layout, Menu, Select, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { FaRegUser, FaRegSave, FaExchangeAlt } from 'react-icons/fa';
import { TbBuildingStore } from 'react-icons/tb';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { TbReportAnalytics } from 'react-icons/tb';
import { IoSearchSharp } from 'react-icons/io5';
import { LuCalculator, LuClipboardList, LuWarehouse, LuPackage, LuServer } from 'react-icons/lu';
import { MdOutlineAdminPanelSettings, MdOutlineDashboard, MdOutlineAccountTree } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/features/sidebarSlice';
import BackupModal from '../Modals/BackupModal';
import { dbBackup } from '../../store/features/companySettingSlice';
import toast from 'react-hot-toast';
import useError from '../../hooks/useError';

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleError = useError();

  const showBackupModal = () => setIsModalVisible(true);
  const closeBackupModal = () => setIsModalVisible(false);

  const handleBackupSuccess = async () => {
    try {
      const res = await dispatch(dbBackup()).unwrap();
      if (res?.data?.download_url) {
        window.open(res?.data?.download_url, '_blank');
        toast.success('Backup successfully generated');
        closeBackupModal();
      } else {
        toast.error('Backup created but file not found');
        closeBackupModal();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const permissions = user?.permission;

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

  const generalGroupPermission =
    !permissions?.currency?.list &&
    !permissions?.company?.list &&
    !permissions?.company_branch?.list &&
    !permissions?.salesman?.list &&
    !permissions?.customer?.list &&
    !permissions?.supplier?.list &&
    !permissions?.agent?.list &&
    !permissions?.commission_agent?.list &&
    !permissions?.sales_team?.list &&
    !permissions?.flag?.list &&
    !permissions?.class?.list &&
    !permissions?.port?.list &&
    !permissions?.vessel?.list &&
    !permissions?.event?.list &&
    // TODO:add customer agent & vessel agent permission here
    !permissions?.setting?.update;

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

  const saleManagementPermission =
    !permissions?.quotation?.list &&
    !permissions?.charge_order?.list &&
    !permissions?.purchase_order?.list &&
    !permissions?.job_order?.list;
  !permissions?.service_order?.list;

  const glSettingPermission =
    !permissions?.gl_accounts_setting?.gl_update &&
    !permissions?.gl_inventory_setting?.inventory_update

  const generalLedgerPermission =
    !permissions?.vendor_payment?.list &&
    !permissions?.customer_payment?.list &&
    !permissions?.payment_voucher?.list &&
    !permissions?.accounts?.list &&
    glSettingPermission

  const accountsPermission =
    glSettingPermission &&
    !permissions?.accounts?.list

  const transactionPermission =
    !permissions?.vendor_payment?.list &&
    !permissions?.payment_voucher?.list &&
    !permissions?.customer_payment?.list

  const warehousingPermission =
    !permissions?.good_received_note?.list &&
    !permissions?.picklist?.list &&
    !permissions?.shipment?.list &&
    !permissions?.purchase_return?.list &&
    !permissions?.stock_return?.list &&
    !permissions?.opening_stock?.list &&
    !permissions?.servicelist?.list;

  const accountingPermission =
    !permissions?.purchase_invoice?.list &&
    !permissions?.sale_invoice?.list &&
    !permissions?.sale_return?.list &&
    !permissions?.gl_accounts_setting?.gl_update &&
    !permissions?.gl_inventory_setting?.inventory_update

  const LogisticsPermission = !permissions?.dispatch?.list;
  const systemPermission = !permissions?.audit?.list;
  const reportsPermission = !permissions?.quote_report?.show && !permissions?.bid_response?.show;
  const vpQuotationPermission = !permissions?.vp_quotation?.list

  const items = [
    {
      key: '/',
      icon: <MdOutlineDashboard size={18} />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: 'administration',
      label: 'Administration',
      icon: <MdOutlineAdminPanelSettings size={18} />,
      disabled: generalGroupPermission && userManagementPermission && inventorySetupPermission,
      children: [
        {
          key: 'general-setup',
          label: 'General Setup',
          disabled: generalGroupPermission,
          children: [
            {
              key: 'currency',
              label: <Link to="/currency">Currency</Link>,
              disabled: !permissions?.currency?.list,
            },
            {
              key: 'company',
              label: <Link to="/company">Company</Link>,
              disabled: !permissions?.company?.list,
            },
            {
              key: 'company-branch',
              label: <Link to="/company-branch">Company Branch</Link>,
              disabled: !permissions?.company_branch?.list,
            },
            {
              key: 'company-setting',
              label: <Link to="/company-setting">Company Setting</Link>,
              disabled: !permissions?.setting?.update,
            },
            {
              key: 'salesman',
              label: <Link to="/salesman">Salesman</Link>,
              disabled: !permissions?.salesman?.list,
            },
            {
              key: 'sales-team',
              label: <Link to="/sales-team">Sales Team</Link>,
              disabled: !permissions?.salesman?.list,
            },
            {
              key: 'customer',
              label: <Link to="/customer">Customer</Link>,
              disabled: !permissions?.customer?.list,
            },
            {
              key: 'vendor',
              label: <Link to="/vendor">Vendor</Link>,
              disabled: !permissions?.supplier?.list,
            },
            {
              key: 'agent',
              label: <Link to="/agent">Agent</Link>,
              disabled: !permissions?.agent?.list,
            },
            {
              key: 'commission-agent',
              label: <Link to="/commission-agent">Commission Agent</Link>,
              disabled: !permissions?.commission_agent?.list,
            },
            {
              key: 'technician',
              label: <Link to="/technician">Technician</Link>,
              disabled: !permissions?.sales_team?.list,
            },
            {
              key: 'notes',
              label: <Link to="/notes">Notes</Link>,
              disabled: !permissions?.terms?.list,
            },
            {
              key: 'flag',
              label: <Link to="/flag">Flag</Link>,
              disabled: !permissions?.flag?.list,
            },
            {
              key: 'class',
              label: <Link to="/class">Class</Link>,
              disabled: !permissions?.class?.list,
            },
            {
              key: 'port',
              label: <Link to="/port">Port</Link>,
              disabled: !permissions?.port?.list,
            },
            {
              key: 'vessel',
              label: <Link to="/vessel">Vessel</Link>,
              disabled: !permissions?.vessel?.list,
            },
            {
              key: 'event',
              label: <Link to="/event">Event</Link>,
              disabled: !permissions?.event?.list,
            },
            {
              key: 'customer-agent',
              label: <Link to="/customer-agent">Customer Agent</Link>,
              // TODO:Add customer agent permission here
            },
            {
              key: 'vessel-agent',
              label: <Link to="/vessel-agent">Vessel Agent</Link>,
              // TODO:Add vessel agent permission here
            },
          ],
        },
        {
          key: 'user-management',
          label: 'User Management',
          disabled: userManagementPermission,
          children: [
            {
              key: 'user',
              label: <Link to="/user">User</Link>,
              disabled: !permissions?.user?.list,
            },
            {
              key: 'user-permission',
              label: <Link to="/user-permission">User Permission</Link>,
              disabled: !permissions.user_permission?.list,
            },
          ],
        },
        {
          key: 'inventory-setup',
          label: 'Inventory Setup',
          disabled: inventorySetupPermission,
          children: [
            {
              key: 'category',
              label: <Link to="/category">Category</Link>,
              disabled: !permissions?.category?.list,
            },
            {
              key: 'sub-category',
              label: <Link to="/sub-category">Sub Category</Link>,
              disabled: !permissions?.sub_category?.list,
            },
            {
              key: 'brand',
              label: <Link to="/brand">Brand</Link>,
              disabled: !permissions?.brand?.list,
            },
            {
              key: 'warehouse',
              label: <Link to="/warehouse">Warehouse</Link>,
              disabled: !permissions?.warehouse?.list,
            },
            {
              key: 'unit',
              label: <Link to="/unit">Unit</Link>,
              disabled: !permissions?.unit?.list,
            },
            {
              key: 'product',
              label: <Link to="/product">Product</Link>,
              disabled: !permissions?.product?.list,
            },
            {
              key: 'validity',
              label: <Link to="/validity">Validity</Link>,
              disabled: !permissions?.validity?.list,
            },
            {
              key: 'payment',
              label: <Link to="/payment">Payment</Link>,
              disabled: !permissions?.payment?.list,
            },
          ],
        },
      ],
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
          disabled: !permissions?.quotation?.list,
        },
        {
          key: 'charge-order',
          label: <Link to="/charge-order">Charge Order</Link>,
          disabled: !permissions?.charge_order?.list,
        },
        {
          key: 'purchase-order',
          label: <Link to="/purchase-order">Purchase Order</Link>,
          disabled: !permissions?.purchase_order?.list,
        },
        {
          key: 'ijo',
          disabled: !permissions?.job_order?.list,
          label: <Link to="/ijo">IJO</Link>,
        },
        {
          key: 'service-order',
          label: <Link to="/service-order">Service Order</Link>,
          disabled: !permissions?.service_order?.list,
        },
      ],
    },
    {
      key: 'warehousing',
      label: 'Warehousing',
      icon: <LuWarehouse size={18} />,
      disabled: warehousingPermission,
      children: [
        {
          key: 'pick-list',
          label: <Link to="/pick-list">Pick List</Link>,
          disabled: !permissions?.picklist?.list,
        },
        {
          key: 'service-list',
          label: <Link to="/service-list">Service List</Link>,
          disabled: !permissions?.servicelist?.list,
        },
        {
          key: 'goods-received-note',
          label: <Link to="/goods-received-note">Goods Received Note</Link>,
          disabled: !permissions?.good_received_note?.list,
        },
        {
          key: 'opening-stock',
          label: <Link to="/opening-stock">Opening Stock</Link>,
          disabled: !permissions?.opening_stock?.list,
        },
        {
          key: 'shipment',
          label: <Link to="/shipment">Shipment</Link>,
          disabled: !permissions?.shipment?.list,
        },
        {
          key: 'stock-return',
          label: <Link to="/stock-return">Stock Return</Link>,
          disabled: !permissions?.stock_return?.list,
        },
        {
          key: 'purchase-return',
          label: <Link to="/purchase-return">Purchase Return</Link>,
          disabled: !permissions?.purchase_return?.list,
        },
      ],
    },
    {
      key: 'accounting',
      label: 'Accounting',
      icon: <LuCalculator size={18} />,
      disabled: accountingPermission,
      children: [
        {
          key: 'purchase-invoice',
          label: <Link to="/purchase-invoice">Purchase Invoice</Link>,
          disabled: !permissions?.purchase_invoice?.list,
        },
        {
          key: 'sale-invoice',
          label: <Link to="/sale-invoice">Sale Invoice</Link>,
          disabled: !permissions?.sale_invoice?.list,
        },
        {
          key: 'credit-note',
          label: <Link to="/credit-note">Credit Note</Link>,
          disabled: !permissions?.sale_return?.list,
        },
      ],
    },
    {
      key: 'logistics',
      label: 'Logistics',
      icon: <LuPackage size={18} />,
      disabled: LogisticsPermission,
      children: [
        {
          key: 'scheduling',
          label: <Link to="/scheduling">Scheduling</Link>,
          disabled: !permissions?.dispatch?.list,
        },
      ],
    },
    {
      key: 'system',
      label: 'System',
      icon: <LuServer size={18} />,
      disabled: systemPermission,
      children: [
        {
          key: 'audit',
          label: <Link to="/audit">Audit</Link>,
          disabled: !permissions?.audit?.list,
        },
      ],
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: <TbReportAnalytics size={18} />,
      disabled: reportsPermission,
      children: [
        {
          key: 'quotation-report',
          label: <Link to="/quotation-report">Quotation Report</Link>,
          disabled: !permissions?.quote_report?.show,
        },
        {
          key: 'bid-response-report',
          label: <Link to="/bid-response-report">Bid Response Report</Link>,
          disabled: !permissions?.bid_response?.show,
        },
      ],
    },
    {
      key: 'backup',
      label: 'Backup',
      icon: <FaRegSave size={18} />,
      onClick: showBackupModal,
      // disabled: LogisticsPermission,
    },
    {
      key: 'vendor platform',
      label: 'Vendor Platform',
      icon: <TbBuildingStore size={18} />,
      disabled: vpQuotationPermission,
      children: [
        {
          key: 'vendor-platform',
          label: <Link to="/vendor-platform">Vendor Quote</Link>,
          disabled: !permissions?.vp_quotation?.list,
        },
      ],
    },
    {
      key: 'general ledger',
      label: 'General Ledger',
      icon: <LuClipboardList size={18} />,
      disabled: generalLedgerPermission,
      children: [
        {
          key: 'gl setup',
          label: 'GL Setup',
          icon: <MdOutlineAccountTree size={18} />,
          disabled: accountsPermission,
          children: [
            {
              key: 'gl module setting',
              label: <Link to="/general-ledger/gl-setup/gl-module-setting">GL Module Setting</Link>,
              disabled: glSettingPermission,
            },
            {
              key: '/general-ledger/gl-setup/accounts',
              label: <Link to="/general-ledger/gl-setup/accounts">Accounts</Link>,
              disabled: !permissions?.accounts?.list,
            },
          ]
        },
        {
          key: 'transaction',
          label: 'Transaction',
          icon: <FaExchangeAlt size={18} />,
          disabled: transactionPermission,
          children: [
            {
              key: 'general-ledger/transactions/customer-payment',
              label: <Link to="/general-ledger/transactions/customer-payment">Customer Payment</Link>,
              disabled: !permissions?.customer_payment?.list,
            },
            {
              key: 'general-ledger/transactions/vendor-payment',
              label: <Link to="/general-ledger/transactions/vendor-payment">Vendor Payment</Link>,
              disabled: !permissions?.vendor_payment?.list,
            },
            {
              key: 'general-ledger/transactions/payment-voucher',
              label: <Link to="/general-ledger/transactions/payment-voucher">Payment Voucher</Link>,
              disabled: !permissions?.payment_voucher?.list,
            },
          ]
        },
      ],
    },
  ];
  const levelKeys = getLevelKeys(items);

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
        items={items}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
      />

      <BackupModal
        open={isModalVisible}
        onCancel={closeBackupModal}
        onBackupSuccess={handleBackupSuccess}
      />
    </Layout.Sider>
  );
};

export default Sidebar;