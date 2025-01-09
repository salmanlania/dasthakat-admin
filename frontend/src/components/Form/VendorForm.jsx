import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const VendorForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.vendor);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="vendor"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : { status: 1 }}
      onFinish={onFinish}
    >
      <Row gutter={[12, 12]}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="supplier_code" label="Code">
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
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="location" label="Location">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="contact_person" label="Contact Person">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="contact1" label="Contact 1">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="contact2" label="Contact 2">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="address" label="Address">
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
      </Row>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/vendor">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default VendorForm;
