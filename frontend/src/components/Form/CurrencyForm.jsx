import { Button, Col, Form, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NumberInput from "../Input/NumberInput";

const CurrencyForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.currency
  );

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="currency"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={
        mode === "edit"
          ? initialFormValues
          : {
              value: "1",
              status: 1,
            }
      }
    >
      <Row gutter={[12, 12]} className="w-full">
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="currency_code"
            label="Currency Code"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Currency code is required!",
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
          <Form.Item name="symbol_left" label="Symbol Left">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="symbol_right" label="Symbol Right">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="value"
            label="Value"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Value is required!",
              },
            ]}
          >
            <NumberInput />
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
        <Link to="/currency">
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

export default CurrencyForm;
