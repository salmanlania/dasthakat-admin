import { Button, Col, Form, Input, Row, Select } from "antd";
import ReactInputMask from "react-input-mask";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../AsyncSelect";

const CustomerForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.customer
  );

  const onFinish = (formValues) => {
    onSubmit({
      ...formValues,
      salesman_id: formValues.salesman_id ? formValues.salesman_id.value : null,
      phone_no: formValues.phone_no?.slice(0, 13),
    });
  };

  return (
    <Form
      name="customer"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === "edit" ? initialFormValues : { status: 1 }}
      onFinish={onFinish}
    >
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
                message: "Name is required!",
              },
            ]}
          >
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
              addNewLink="/salesman"
            />
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
            <ReactInputMask mask="+999999999999">
              {(inputProps) => <Input {...inputProps} />}
            </ReactInputMask>
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
        <Button
          type="primary"
          htmlType="submit"
          className="w-28"
          loading={isFormSubmitting}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CustomerForm;
