import { Breadcrumb, Button, Dropdown, Form, Select, Spin, Table } from 'antd';
import PageHeading from '../../components/Heading/PageHeading';
import { useDispatch, useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  addCommissionDetail,
  changeCommissionDetailOrder,
  changeCommissionDetailValue,
  copyCommissionDetail,
  getCustomer,
  removeCommissionDetail,
  resetCommissionDetails,
  updateCustomer,
} from '../../store/features/customerSlice';
import DebouncedNumberInput from '../../components/Input/DebouncedNumberInput';
import AsyncSelect from '../../components/AsyncSelect';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { BiPlus } from 'react-icons/bi';
import useError from '../../hooks/useError';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const CustomerAgent = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const { isItemLoading, isFormSubmitting, commissionDetails, initialFormValues } = useSelector(
    (state) => state.customer,
  );

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addCommissionDetail())}
        />
      ),
      key: 'order',
      dataIndex: 'order',
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(changeCommissionDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === commissionDetails.length - 1}
              onClick={() => {
                dispatch(changeCommissionDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Commission Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, { type }, index) => {
        return (
          <Select
            className="w-full"
            options={[
              {
                value: 'Other',
                label: 'Other',
              },
            ]}
            value={type}
            onChange={(selected) =>
              dispatch(
                changeCommissionDetailValue({
                  index,
                  key: 'type',
                  value: selected,
                }),
              )
            }
          />
        );
      },
      width: 120,
    },
    {
      title: 'Commission Agent',
      dataIndex: 'commission_agent_id',
      key: 'commission_agent_id',
      render: (_, { commission_agent_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/commission-agent"
            valueKey="commission_agent_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={commission_agent_id}
            onChange={(selected) =>
              dispatch(
                changeCommissionDetailValue({
                  index,
                  key: 'commission_agent_id',
                  value: selected,
                }),
              )
            }
            addNewLink={permissions.commission_agent.add ? '/commission-agent/create' : null}
          />
        );
      },
      width: 240,
    },
    {
      title: 'Commission %',
      dataIndex: 'commission_percentage',
      key: 'commission_percentage',
      render: (_, { commission_percentage }, index) => {
        return (
          <DebouncedNumberInput
            value={commission_percentage}
            type="decimal"
            onChange={(value) =>
              dispatch(
                changeCommissionDetailValue({
                  index,
                  key: 'commission_percentage',
                  value: value,
                }),
              )
            }
          />
        );
      },
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }, index) => {
        return (
          <Select
            className="w-full"
            options={[
              {
                value: 'Active',
                label: 'Active',
              },
              {
                value: 'Inactive',
                label: 'Inactive',
              },
            ]}
            value={status}
            onChange={(selected) =>
              dispatch(
                changeCommissionDetailValue({
                  index,
                  key: 'status',
                  value: selected,
                }),
              )
            }
          />
        );
      },
      width: 120,
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addCommissionDetail())}
        />
      ),
      key: 'action',
      render: (record, { id }, index) => {
        return (
          <Dropdown
            trigger={['click']}
            arrow
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Add',
                  onClick: () => dispatch(addCommissionDetail(index)),
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyCommissionDetail(index)),
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeCommissionDetail(id)),
                },
              ],
            }}>
            <Button size="small">
              <BsThreeDotsVertical />
            </Button>
          </Dropdown>
        );
      },
      width: 50,
      fixed: 'right',
    },
  ];

  const onCustomerChange = async (customerID) => {
    dispatch(resetCommissionDetails());

    if (!customerID) {
      return;
    }

    try {
      await dispatch(getCustomer(customerID)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const updateDetails = async () => {
    const customerID = form.getFieldValue('customer_id');

    const payload = {
      ...initialFormValues,
      salesman_id: initialFormValues.salesman_id ? initialFormValues.salesman_id.value : null,
      payment_id: initialFormValues.payment_id ? initialFormValues.payment_id.value : null,
      vessel_id: initialFormValues.vessel_id
        ? initialFormValues.vessel_id.map((v) => v.value)
        : null,
      customer_commission_agent: commissionDetails.map((detail) => ({
        ...detail,
        customer_commission_agent_id: detail.row_status === 'I' ? null : detail.id,
        commission_agent_id: detail?.commission_agent_id?.value || null,
      })),
    };

    try {
      await dispatch(updateCustomer({ id: customerID, data: payload })).unwrap();
      toast.success('Customer Agent updated successfully');
      await dispatch(getCustomer(customerID)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetCommissionDetails());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CUSTOMER AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Customer Agent' }, { title: 'Update' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-4">
        <Form name="customer-agent" autoComplete="off" layout="vertical" form={form}>
          <Form.Item name="customer_id" label="Customer">
            <AsyncSelect
              endpoint="/customer"
              valueKey="customer_id"
              labelKey="name"
              className="w-full sm:max-w-[300px]"
              required
              placeholder="Select Customer"
              onChange={(value) => onCustomerChange(value)}
            />
          </Form.Item>

          <Table
            columns={columns}
            dataSource={commissionDetails}
            rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
            rowKey={'id'}
            size="small"
            loading={isItemLoading}
            scroll={{ x: 'calc(100% - 200px)' }}
            pagination={false}
            sticky={{
              offsetHeader: 56,
            }}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              htmlType="button"
              loading={isFormSubmitting}
              disabled={isItemLoading}
              onClick={updateDetails}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default CustomerAgent;
