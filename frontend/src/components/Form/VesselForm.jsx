import { Button, Col, Form, Input, Row } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../AsyncSelect";

const VesselForm = ({ mode, onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.vessel
  );

  const onFinish = (values) => {
    const data = {
      ...values,
      flag_id: values.flag_id ? values.flag_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
    };

    onSubmit(data);
  };

  return (
    <Form
      name="vessel"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={mode === "edit" ? initialFormValues : null}
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
          <Form.Item name="flag_id" label="Flag">
            <AsyncSelect
              endpoint="/flag"
              valueKey="flag_id"
              labelKey="name"
              labelInValue
              addNewLink="/flag"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class1_id" label="Class 1">
            <AsyncSelect
              endpoint="/class"
              valueKey="class_id"
              labelKey="name"
              labelInValue
              addNewLink="/class"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class2_id" label="Class 2">
            <AsyncSelect
              endpoint="/class"
              valueKey="class_id"
              labelKey="name"
              labelInValue
              addNewLink="/class"
            />
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
