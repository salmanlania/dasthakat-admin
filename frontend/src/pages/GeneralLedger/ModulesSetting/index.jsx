import {
  Button,
  Form,
  Spin,
  Tabs,
  Typography
} from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GeneralLedgerSettingForm from '../../../components/Form/GeneralLedgerSettingForm.jsx';
import InventorySettingForm from '../../../components/Form/InventorySettingForm.jsx';
import useDocumentTitle from '../../../hooks/useDocumentTitle.js';
import useError from '../../../hooks/useError.jsx';
import {
  getCompanySetting,
  updateCompanySetting,
  getCompanyDefaultAcountsSetting
} from '../../../store/features/companySettingSlice.js';

const { TabPane } = Tabs;
const { Title } = Typography;

const ModulesSetting = () => {
  useDocumentTitle('GL Module Setting');
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { initialFormValues, isItemLoading, initialFormData, isFormDataLoading } = useSelector(
    (state) => state.companySetting,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission;
  const bothPermission =
    permissions?.gl_inventory_setting?.inventory_update ||
    permissions?.gl_accounts_setting?.gl_update

  useEffect(() => {
    const fieldKeyMap = {
      transaction_account: 'transaction_account',
      cash_account: 'cash_account',
      sales_tax_account: 'sales_tax_account',
      suspense_account: 'suspense_account',
      customer_outstanding_account: 'default_receivable_account',
      vendor_outstanding_account: 'default_payable_account',
      undeposited_account: 'undeposited_account',
      // inventory settings
      inventory_accounts: 'inventory_accounts',
      revenue_accounts: 'revenue_accounts',
      cogs_accounts: 'cogs_accounts',
      adjustment_accounts: 'adjustment_accounts',
      purchase_discount_account: 'purchase_discount_account',
      sale_discount_account: 'sale_discount_account',
      pl_account: 'pl_account',
      cartage_account: 'cartage_account',
      contra_account: 'contra_account',
    };

    const combinedData = [
      ...(initialFormValues || []),
      ...(initialFormData || []),
    ];

    if (combinedData.length > 0) {
      const formValues = combinedData.reduce((acc, item) => {
        const formKey = fieldKeyMap[item.field];
        if (formKey) {
          if (Array.isArray(item.value) && item.value.length > 0 && item.value[0]?.account_id) {
            acc[formKey] = item.value.map(v => {
              return {
                key: v.account_id,
                value: v.account_id,
                label: v.name,
              };
            });
          }
          else if (typeof item.value === "object" && item.value.includes("-")) {
            acc[formKey] = {
              key: item.value,
              value: item.value,
              label: item.field,
            }
          }
          else {
            acc[formKey] = item.value;
          }
        }
        return acc;
      }, {});
      form.setFieldsValue(formValues);
    }

    if (permissions?.gl_accounts_setting?.gl_update) {
      setActiveTab("1");
    } else if (permissions?.gl_inventory_setting?.inventory_update) {
      setActiveTab("2");
    }
  }, [initialFormValues, form, initialFormData, permissions]);

  useEffect(() => {
    dispatch(getCompanySetting());
    dispatch(getCompanyDefaultAcountsSetting());
  }, [dispatch]);

  const onFinish = async (values) => {
    const normalizeToIdArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) {
        return val.map(v => (typeof v === "object" ? v.value || v.account_id : v));
      }
      return [val];
    };
    try {
      const gl_accounts_setting = {
        transaction_account: values.transaction_account,
        cash_account: normalizeToIdArray(values.cash_account),
        sales_tax_account: normalizeToIdArray(values.sales_tax_account),
        suspense_account: normalizeToIdArray(values.suspense_account),
        default_payable_account: normalizeToIdArray(values.default_payable_account),
        undeposited_account: normalizeToIdArray(values.undeposited_account),
        default_receivable_account: normalizeToIdArray(values.default_receivable_account),
      };

      const inventory_accounts_setting = {
        inventory_accounts: normalizeToIdArray(values.inventory_accounts),
        revenue_accounts: normalizeToIdArray(values.revenue_accounts),
        cogs_accounts: normalizeToIdArray(values.cogs_accounts),
        adjustment_accounts: normalizeToIdArray(values.adjustment_accounts),
        purchase_discount_account: normalizeToIdArray(values.purchase_discount_account),
        sale_discount_account: normalizeToIdArray(values.sale_discount_account),
        pl_account: normalizeToIdArray(values.pl_account),
        cartage_account: normalizeToIdArray(values.cartage_account),
        contra_account: normalizeToIdArray(values.contra_account),
      };

      const data = {
        ...(permissions?.gl_accounts_setting?.gl_update && {
          gl_accounts_setting
        }),
        ...(permissions?.gl_inventory_setting?.inventory_update && {
          inventory_accounts_setting
        }),
      };

      await dispatch(updateCompanySetting(data)).unwrap();
      toast.success('Update Setting Successfully!');
      dispatch(getCompanySetting()).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const dashboardRedirection = () => {
    navigate('/');
  };

  return (
    <Spin spinning={isItemLoading || isFormDataLoading}>
      <div className="min-h-screen bg-white">
        <div className="px-6 py-4">
          <Title level={4} className="mb-1">
            Module Setting
          </Title>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            mailEngine: 'Mail',
          }}>
          <div className="px-6">
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6" type="card">
              {permissions?.gl_accounts_setting?.gl_update
                ? (
                  <TabPane tab="General Ledger" key="1">
                    <GeneralLedgerSettingForm />
                  </TabPane>
                )
                : null
              }
              {permissions?.gl_inventory_setting?.inventory_update
                ? (
                  <TabPane TabPane tab="Inventory" key="2">
                    <InventorySettingForm />
                  </TabPane>
                )
                : null
              }
            </Tabs>
          </div>

          <div className="mt-6 flex justify-end px-6 py-4">
            <Button className="mr-2" onClick={dashboardRedirection}>
              Exit
            </Button>
            {bothPermission
              ? (
                <Button type="primary" onClick={() => form.submit()}>
                  Save
                </Button>
              )
              : null
            }
          </div>
        </Form>
      </div >
    </Spin >
  );
};

export default ModulesSetting;
