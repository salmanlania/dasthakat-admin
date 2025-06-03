import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import AsyncSelect from '../AsyncSelect';
import NumberInput from '../Input/NumberInput';
import CountrySelect from '../Select/CountrySelect';

// eslint-disable-next-line react/prop-types
const CustomerForm = ({ mode = 'create', onSubmit }) => {
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const onFinish = (values) => {
    onSubmit({
      ...values,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.map((v) => v.value) : null
    });
  };

  return (
    <Form
      name="customer"
      layout="vertical"
      autoComplete="off"
      initialValues={mode === 'edit' ? initialFormValues : { status: 1, country: 'United States' }}
      onFinish={onFinish}>
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
                message: 'Name is required!'
              }
            ]}>
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
              addNewLink={
                permissions.salesman.list && permissions.salesman.add ? '/salesman' : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="country" label="Country">
            <CountrySelect allowClear />
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
          <Form.Item name="phone_no" label="Phone No">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="payment_id" label="Payment Terms">
            <AsyncSelect
              endpoint="/payment"
              valueKey="payment_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.payment.list && permissions.payment.add ? '/payment' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <AsyncSelect
              endpoint="/vessel"
              valueKey="vessel_id"
              labelKey="name"
              params={{
                customer_id: id
              }}
              labelInValue
              disabled
              addNewLink={permissions.vessel.add ? '/vessel/create' : null}
              mode="multiple"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="rebate_percent"
            label="Rebate %"
            rules={[
              {
                validator: (_, value) => {
                  if (value > 100) {
                    return Promise.reject(new Error('Rebate % cannot exceed 100%'));
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <NumberInput type="decimal" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={1} />
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
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="block_status" label="Block Status">
            <Select
              className="w-full"
              allowClear
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/customer">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CustomerForm;
