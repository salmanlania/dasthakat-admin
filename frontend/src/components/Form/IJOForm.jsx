import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useError from '../../hooks/useError';
import { getEventChargeOrders, setChargeOrderDetails } from '../../store/features/ijoSlice';
import AsyncSelect from '../AsyncSelect';

// eslint-disable-next-line react/prop-types
const IJOForm = ({ mode = 'create', onSubmit }) => {
  const dispatch = useDispatch();
  const handleError = useError();
  const [form] = Form.useForm();
  const { isFormSubmitting, initialFormValues, chargeOrderDetails } = useSelector(
    (state) => state.ijo
  );
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
      width: 140
    },
    {
      title: 'Product Type',
      dataIndex: 'product_type',
      key: 'product_type',
      width: 120
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 300
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300
    },
    {
      title: 'Customer Notes',
      dataIndex: 'customer_notes',
      key: 'customer_notes',
      width: 240
    },
    {
      title: 'Internal Notes',
      dataIndex: 'internal_notes',
      key: 'internal_notes',
      width: 240
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 80
    }
  ];

  const onFinish = (values) => {
    const payload = {
      imo: values.imo,
      event_id: values?.event_id?.value || null,
      salesman_id: values?.salesman_id?.value || null,
      vessel_id: values?.vessel_id?.value || null,
      flag_id: values?.flag_id?.value || null,
      class1_id: values?.class1_id?.value || null,
      class2_id: values?.class2_id?.value || null,
      agent_id: values?.agent_id?.value || null
    };

    onSubmit(payload);
  };

  const onEventChange = async (selected) => {
    form.setFieldsValue({
      vessel_id: null,
      customer_id: null,
      class1_id: null,
      class2_id: null,
      flag_id: null
    });
    dispatch(setChargeOrderDetails([]));

    try {
      const data = await dispatch(getEventChargeOrders(selected.value)).unwrap();

      const { event, charge_orders } = data;
      form.setFieldsValue({
        salesman_id: event?.customer?.salesman
          ? {
              value: event.customer.salesman.salesman_id,
              label: event.customer.salesman.name
            }
          : null,
        vessel_id: event?.vessel
          ? { value: event.vessel.vessel_id, label: event.vessel.name }
          : null,
        imo: event?.vessel?.imo || null,
        class1_id: event?.class1
          ? { value: event.class1.class_id, label: event.class1.name }
          : null,
        class2_id: event?.class2
          ? { value: event.class2.class_id, label: event.class2.name }
          : null,
        flag_id: event?.vessel?.flag
          ? {
              value: event.vessel.flag.flag_id,
              label: event.vessel.flag.name
            }
          : null
      });

      if (!charge_orders || !charge_orders.length) return;

      const eventChargeDetails = [];

      charge_orders.forEach(({ document_identity, charge_order_detail }) => {
        const chargeOrderNo = document_identity;

        charge_order_detail.forEach((detail) => {
          eventChargeDetails.push({
            id: detail.charge_order_detail_id,
            charge_order_no: chargeOrderNo,
            product_type: detail?.product_type?.name,
            product_code: detail?.product_code,
            product_name:
              detail?.product_type?.product_type_id == 4
                ? detail?.product_name
                : detail?.product?.product_name,
            description: detail?.product_description,
            customer_notes: detail?.description,
            internal_notes: detail?.internal_notes,
            quantity: parseFloat(detail?.quantity || 0),
            unit: detail?.unit?.name || null
          });
        });
      });

      dispatch(setChargeOrderDetails(eventChargeDetails));
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="ijo"
      layout="vertical"
      form={form}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        scrollMode: 'always'
      }}
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : null}
      onFinish={onFinish}>
      <Row gutter={[12, 12]}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="event_id"
            label="Event"
            rules={[{ required: true, message: 'Event is required!' }]}>
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
          <Form.Item name="salesman_id" label="Sales Person">
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
              labelKey="name"
              labelInValue
              addNewLink={permissions.agent.list && permissions.agent.add ? '/agent/create' : null}
            />
          </Form.Item>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={chargeOrderDetails}
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
