import { Button, Col, Form, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../AsyncSelect";

const EventForm = ({ mode, onSubmit }) => {
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
      name="event"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={initialFormValues}
    >
      <Row gutter={[12, 12]} className="w-full">
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="event_code" label="Event Code">
            <Input disabled placeholder="Auto" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer" label="Customer">
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
          <Form.Item name="Vessel" label="Vessel">
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
        <Link to="/event">
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

export default EventForm;
