import { Button, Col, Form, Input, Row, Select } from "antd";
import { Link } from "react-router-dom";

const SupplierForm = () => {
  return (
    <Form
      name="supplier"
      layout="vertical"
      autoComplete="off"
      initialValues={{ status: 0 }}
    >
      <Row gutter={[12, 12]}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Code is required!",
              },
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
                message: "Name is required!",
              },
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
                  label: "Active",
                },
                {
                  value: 0,
                  label: "Inactive",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4 flex gap-2 justify-end items-center">
        <Link to="/supplier">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default SupplierForm;
