import { Button, Col, Form, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../AsyncSelect";

const VesselForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.company
  );

  const onFinish = (formValues) => {
    const data = {
      ...formValues,
    };

    // onSubmit(data);
  };

  return (
    <Form
      name="vessel"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={initialFormValues}
    >
      <Row gutter={[12, 12]} className="w-full">
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="imo" label="IMO">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="flag" label="Flag">
            {/* <AsyncSelect
                endpoint="/currency"
                valueKey="currency_id"
                labelKey="name"
                labelInValue
              /> */}
            <Select />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class1" label="Class 1">
            {/* <AsyncSelect
                endpoint="/currency"
                valueKey="currency_id"
                labelKey="name"
                labelInValue
              /> */}
            <Select />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class2" label="Class 2">
            {/* <AsyncSelect
                endpoint="/currency"
                valueKey="currency_id"
                labelKey="name"
                labelInValue
              /> */}
            <Select />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4 flex gap-2 justify-end items-center">
        <Link to="/vessel">
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

export default VesselForm;
