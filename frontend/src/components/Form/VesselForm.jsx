import { Button, Col, Form, Input, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../AsyncSelect';

// eslint-disable-next-line react/prop-types
const VesselForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.vessel);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const onFinish = (values) => {
    const data = {
      ...values,
      customer_id: values.customer_id ? values.customer_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null
    };

    onSubmit(data);
  };

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
              addNewLink={
                permissions.customer.list && permissions.customer.add ? '/customer/create' : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
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
        <Col span={24} sm={12} md={8} lg={8}>
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
        <Col span={24} sm={12} md={8} lg={8}>
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
        <Col span={24}>
          <Form.Item name="billing_address" label="Billing Address">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
      </Row>

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
