import { Button, Col, Form, Input, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const CommissionAgentForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.commissionAgent);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="commission-agent"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : { status: 1 }}
      onFinish={onFinish}>
      <Row gutter={[12, 12]}>
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
          <Form.Item name="phone" label="Telephone">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/commission-agent">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CommissionAgentForm;
