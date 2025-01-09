import { Button, Col, Form, Input, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const AgentForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.agent);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="agent"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : { status: 1 }}
      onFinish={onFinish}
    >
      <Row gutter={[12, 12]}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="agent_code"
            label="Code"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Code is required!'
              }
            ]}
          >
            <Input />
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
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="address" label="Physical Address">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="zip_code" label="Zip Code">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="fax" label="Fax">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/agent">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default AgentForm;
