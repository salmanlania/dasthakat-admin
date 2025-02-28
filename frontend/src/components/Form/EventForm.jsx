import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { MdOutlineAddCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useError from '../../hooks/useError';
import { getCustomer } from '../../store/features/customerSlice';
import { getVessel } from '../../store/features/vesselSlice';
import AsyncSelect from '../AsyncSelect';

// eslint-disable-next-line react/prop-types
const EventForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const [vessels, setVessels] = useState([]);
  const customerID = Form.useWatch('customer_id', form);

  const permissions = user.permission;

  const onFinish = (values) => {
    const data = {
      ...values,
      customer_id: values.customer_id ? values.customer_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null
    };

    onSubmit(data);
  };

  const onVesselSelect = async (selected) => {
    form.setFieldsValue({
      class1_id: null,
      class2_id: null
    });

    if (!selected) return;
    try {
      const data = await dispatch(getVessel(selected.value)).unwrap();
      form.setFieldsValue({
        class1_id: { value: data.class1_id, label: data.class1_name },
        class2_id: { value: data.class2_id, label: data.class2_name }
      });
    } catch (error) {
      handleError(error);
    }
  };

  const getCustomerVessels = async () => {
    try {
      const data = await dispatch(getCustomer(customerID.value)).unwrap();
      const vessels = data.vessel
        ? data.vessel.map((v) => ({ value: v.vessel_id, label: v.name }))
        : [];
      setVessels(vessels);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (customerID) getCustomerVessels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerID, dispatch]);

  return (
    <Form
      name="event"
      layout="vertical"
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      initialValues={
        mode === 'edit'
          ? initialFormValues
          : {
              status: 1
            }
      }>
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
              addNewLink={
                permissions.customer.list && permissions.customer.add ? '/customer/create' : null
              }
              onChange={() => {
                form.setFieldsValue({
                  vessel_id: null,
                  class1_id: null,
                  class2_id: null
                });
                setVessels([]);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <Select
              options={vessels}
              showSearch
              labelInValue
              onChange={onVesselSelect}
              onDropdownVisibleChange={(open) => (open && customerID ? getCustomerVessels() : null)}
              suffixIcon={
                permissions.vessel.add ? (
                  <MdOutlineAddCircle
                    className="absolute !-top-4 cursor-pointer rounded-full bg-white text-primary hover:text-blue-700"
                    size={18}
                    onClick={() => {
                      window.open(
                        `${import.meta.env.VITE_BASE_URL}/vessel/create`,
                        '_blank',
                        'toolbar=yes,scrollbars=yes,top=100,left=400,width=600,height=600'
                      );
                    }}
                  />
                ) : null
              }
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
              addNewLink={permissions.class.list && permissions.class.add ? '/class' : null}
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
              addNewLink={permissions.class.list && permissions.class.add ? '/class' : null}
            />
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
        <Link to="/event">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default EventForm;
