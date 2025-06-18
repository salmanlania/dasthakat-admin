import { Button, Col, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  addCommissionDetail,
  changeCommissionDetailOrder,
  changeCommissionDetailValue,
  copyCommissionDetail,
  removeCommissionDetail
} from '../../store/features/customerSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedNumberInput from '../Input/DebouncedNumberInput';
import NumberInput from '../Input/NumberInput';
import CountrySelect from '../Select/CountrySelect';

// eslint-disable-next-line react/prop-types
const CustomerForm = ({ mode = 'create', onSubmit }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, commissionDetails } = useSelector(
    (state) => state.customer
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const onFinish = (values) => {
    const payload = {
      ...values,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.map((v) => v.value) : null,
      customer_commission_agent: commissionDetails.map((detail) => ({
        ...detail,
        customer_commission_agent_id: mode === 'edit' ? detail.id : null,
        commission_agent_id: detail?.commission_agent_id?.value || null
      }))
    };

    onSubmit(payload);
  };

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
      fixed: 'left'
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
      fixed: 'left'
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
                label: 'Other'
              }
            ]}
            value={type}
            onChange={(selected) =>
              dispatch(
                changeCommissionDetailValue({
                  index,
                  key: 'type',
                  value: selected
                })
              )
            }
          />
        );
      },
      width: 120
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
                  value: selected
                })
              )
            }
            addNewLink={permissions.commission_agent.add ? '/commission-agent/create' : null}
          />
        );
      },
      width: 240
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
                  value: value
                })
              )
            }
          />
        );
      },
      width: 140
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
                label: 'Active'
              },
              {
                value: 'Inactive',
                label: 'Inactive'
              }
            ]}
            value={status}
            onChange={(selected) =>
              dispatch(
                changeCommissionDetailValue({
                  index,
                  key: 'status',
                  value: selected
                })
              )
            }
          />
        );
      },
      width: 120
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
                  onClick: () => dispatch(addCommissionDetail(index))
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyCommissionDetail(index))
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeCommissionDetail(id))
                }
              ]
            }}>
            <Button size="small">
              <BsThreeDotsVertical />
            </Button>
          </Dropdown>
        );
      },
      width: 50,
      fixed: 'right'
    }
  ];

  return (
    <Form
      name="customer"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : { status: 1, country: 'United States' }}
      onFinish={onFinish}>
      <Row gutter={[12, 12]}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_code" label="Code">
            <Input disabled placeholder="Auto" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Name is required!'
              }
            ]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="salesman_id" label="Salesman">
            <AsyncSelect
              endpoint="/salesman"
              valueKey="salesman_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.salesman.list && permissions.salesman.add ? '/salesman' : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="country" label="Country">
            <CountrySelect allowClear />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="email_sales" label="Email Sales">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="email_accounting" label="Email Accounting">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="phone_no" label="Phone No">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="payment_id" label="Payment Terms">
            <AsyncSelect
              endpoint="/payment"
              valueKey="payment_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.payment.list && permissions.payment.add ? '/payment' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <AsyncSelect
              endpoint="/vessel"
              valueKey="vessel_id"
              labelKey="name"
              params={{
                customer_id: id
              }}
              labelInValue
              disabled
              addNewLink={permissions.vessel.add ? '/vessel/create' : null}
              mode="multiple"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="rebate_percent"
            label="Rebate %"
            rules={[
              {
                validator: (_, value) => {
                  if (value > 100) {
                    return Promise.reject(new Error('Rebate % cannot exceed 100%'));
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <NumberInput type="decimal" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="billing_address" label="Billing Address">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                {
                  value: 1,
                  label: 'Active'
                },
                {
                  value: 0,
                  label: 'Inactive'
                }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="block_status" label="Block Status">
            <Select
              className="w-full"
              allowClear
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' }
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!border-gray-300">
        Commission Details
      </Divider>

      <Table
        columns={columns}
        dataSource={commissionDetails}
        rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
        rowKey={'id'}
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      />

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/customer">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CustomerForm;
