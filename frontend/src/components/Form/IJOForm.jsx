import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import useError from '../../hooks/useError';
import { getEventChargeOrders } from '../../store/features/ijoSlice';
import AsyncSelect from '../AsyncSelect';

// eslint-disable-next-line react/prop-types
const IJOForm = ({ mode = 'create', onSubmit }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleError = useError();
  const [form] = Form.useForm();
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.ijo);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50
    },
    {
      title: 'Charge Order No.',
      dataIndex: 'charge_order_no',
      key: 'charge_order_no',
      width: 150
    },
    {
      title: 'Product Type',
      dataIndex: 'product_type',
      key: 'product_type',
      width: 150
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120
    },
    {
      title: 'Description',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 560
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      width: 240
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 100
    }
  ];

  const onFinish = (values) => {
    onSubmit({
      ...values,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.map((v) => v.value) : null
    });
  };

  const onEventChange = async (selected) => {
    form.setFieldsValue({
      vessel_id: null,
      customer_id: null,
      class1_id: null,
      class2_id: null,
      flag_id: null
    });

    if (!selected) return;
    try {
      const data = await dispatch(getEventChargeOrders(selected.value)).unwrap();
      console.log(data);

      const { event } = data;
      form.setFieldsValue({
        vessel_id: event?.vessel
          ? { value: event.vessel.class_id, label: event.vessel.name }
          : null,
        customer_id: event?.customer
          ? { value: event.customer.class_id, label: event.customer.name }
          : null,
        class1_id: event?.class1
          ? { value: event.class1.class_id, label: event.class1.name }
          : null,
        class2_id: event?.class2
          ? { value: event.class2.class_id, label: event.class2.name }
          : null,
        flag_id: event?.flag ? { value: event.flag.class_id, label: event.flag.name } : null
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="ijo"
      layout="vertical"
      form={form}
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : { status: 1, country: 'United States' }}
      onFinish={onFinish}>
      <Row gutter={[12, 12]}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="event_id" label="Event">
            <AsyncSelect
              endpoint="/event"
              valueKey="event_id"
              labelKey="event_code"
              labelInValue
              addNewLink={permissions.event.list && permissions.event.add ? '/event/create' : null}
              onChange={onEventChange}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="sales_person" label="Sales Person">
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="imo" label="IMO">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="flag_id" label="Flag">
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class1_id" label="Class 1">
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class2_id" label="Class 2">
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="agent_id" label="Agent">
            <AsyncSelect
              endpoint="/agent"
              valueKey="agent_id"
              labelKey="agent_code"
              labelInValue
              addNewLink={permissions.agent.list && permissions.agent.add ? '/agent/create' : null}
            />
          </Form.Item>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={[]}
        rowKey="id"
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      />

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/ijo">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default IJOForm;
