import { Button, Col, Form, Input, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../AsyncSelect";
import useError from "../../hooks/useError";
import { getVessel } from "../../store/features/vesselSlice";

const EventForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();

  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.event
  );

  const onFinish = (values) => {
    const data = {
      ...values,
      customer_id: values.customer_id ? values.customer_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
    };

    onSubmit(data);
  };

  const onVesselSelect = async (selected) => {
    if (!selected) {
      form.setFieldsValue({
        class1_id: null,
        class2_id: null,
      });
      return;
    }

    try {
      const data = await dispatch(getVessel(selected.value)).unwrap();
      form.setFieldsValue({
        class1_id: { value: data.class1_id, label: data.class1_name },
        class2_id: { value: data.class2_id, label: data.class2_name },
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="event"
      layout="vertical"
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      initialValues={mode === "edit" ? initialFormValues : null}
    >
      <Row gutter={[12, 12]} className="w-full">
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="event_code" label="Event Code">
            <Input disabled placeholder="Auto" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_id" label="Customer">
            <AsyncSelect
              endpoint="/customer"
              valueKey="customer_id"
              labelKey="name"
              labelInValue
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <AsyncSelect
              endpoint="/vessel"
              valueKey="vessel_id"
              labelKey="name"
              labelInValue
              onChange={onVesselSelect}
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
            />
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
