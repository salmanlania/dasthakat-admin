import { Button, Col, Form, Input, Row, Select } from "antd";
import { Link } from "react-router-dom";

const CustomerForm = () => {
  return (
    <Form
      name="customer"
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
          <Form.Item name="salesman" label="Salesman">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="phone_no" label="Phone No">
            <Input />
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
        <Link to="/customer">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CustomerForm;
