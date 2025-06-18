import { Button, Col, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../AsyncSelect';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiPlus } from 'react-icons/bi';
import DebouncedNumberInput from '../Input/DebouncedNumberInput';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import {
  addCommissionDetail,
  changeCommissionDetailOrder,
  changeCommissionDetailValue,
  copyCommissionDetail,
  removeCommissionDetail
} from '../../store/features/vesselSlice';

// eslint-disable-next-line react/prop-types
const VesselForm = ({ mode, onSubmit }) => {
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, commissionDetails } = useSelector(
    (state) => state.vessel
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const onFinish = (values) => {
    const data = {
      ...values,
      customer_id: values.customer_id ? values.customer_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      vesssel_commission_agent: commissionDetails.map((detail) => ({
        ...detail,
        vesssel_commission_agent_id: mode === 'edit' ? detail.id : null,
        commission_agent_id: detail?.commission_agent_id?.value || null
      }))
    };

    onSubmit(data);
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
      name="vessel"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={mode === 'edit' ? initialFormValues : null}>
      <Row gutter={[12, 12]} className="w-full">
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="imo"
            label="IMO"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'IMO is required!'
              }
            ]}>
            <Input autoFocus />
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
          <Form.Item
            name="customer_id"
            label="Customer"
            rules={[{ required: true, message: 'Customer is required!' }]}>
            <AsyncSelect
              endpoint="/customer"
              valueKey="customer_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.customer.add ? '/customer/create' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item
            name="flag_id"
            label="Flag"
            rules={[{ required: true, message: 'Flag is required!' }]}>
            <AsyncSelect
              endpoint="/flag"
              valueKey="flag_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.flag.list && permissions.flag.add ? '/flag' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item
            name="class1_id"
            label="Class 1"
            rules={[{ required: true, message: 'Class 1 is required!' }]}>
            <AsyncSelect
              endpoint="/class"
              valueKey="class_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.class.list && permissions.class.add ? '/class' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="class2_id" label="Class 2">
            <AsyncSelect
              endpoint="/class"
              valueKey="class_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.class.list && permissions.class.add ? '/class' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
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
        <Col span={24}>
          <Form.Item name="billing_address" label="Billing Address">
            <Input.TextArea rows={1} />
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
        <Link to="/vessel">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default VesselForm;
