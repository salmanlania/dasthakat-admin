import { Button, Col, Form, Input, Row, Select } from "antd";
import ReactInputMask from "react-input-mask";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SupplierForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.supplier
  );

  const onFinish = (formValues) => {
    onSubmit({
      ...formValues,
      contact1: formValues.contact1?.slice(0, 13),
      contact2: formValues.contact1?.slice(0, 13),
    });
  };

  return (
    <Form
      name="supplier"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === "edit" ? initialFormValues : { status: 1 }}
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
          <Form.Item name="contact_person" label="Contact Person">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="contact1" label="Contact 1">
            <ReactInputMask mask="+999999999999">
              {(inputProps) => <Input {...inputProps} />}
            </ReactInputMask>
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="contact2" label="Contact 2">
            <ReactInputMask mask="+999999999999">
              {(inputProps) => <Input {...inputProps} />}
            </ReactInputMask>
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Please enter a valid email" }]}
          >
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

export default SupplierForm;
