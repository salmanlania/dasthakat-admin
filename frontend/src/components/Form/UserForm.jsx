import { Button, Col, Form, Image, Input, Row, Select, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link } from 'react-router-dom';
import userImagePlaceholder from '../../assets/user-placeholder.jpg';
import AsyncSelect from '../AsyncSelect';

// eslint-disable-next-line react/prop-types
const UserForm = ({ mode = 'create', onSubmit }) => {
  const fileInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const userTypeOptions = [
    { label: "Admin", value: "admin" },
    { label: "Orders Manager", value: "orders" },
    { label: "Inventory / Warehouse", value: "warehouse" },
    { label: "Tailor / Production", value: "production" },
    { label: "Sales / Customer Support", value: "sales" },
    { label: "Accounts / Finance", value: "accounts" }
  ];

  const onFinish = (formValues) => {
    const data = {
      ...formValues,
    };

    onSubmit(data);
  };

  return (
    <Form
      name="user"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      initialValues={
        mode === 'create'
          ? {
            status: 1
          }
          : null //initialFormValues
      }>
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items-start">
        <Row gutter={[12, 12]}>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="user_name"
              label="User Name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'User name is required!'
                }
              ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="user_type"
              label="User Type"
              rules={[
                {
                  required: true,
                  message: 'User Type is required!'
                }
              ]}>
              <Select size="middle" className="w-full" allowClear options={userTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="phone_no"
              label="Phone Number"
            >
              <PhoneInput country={'us'} enableSearch inputStyle={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Email is required!'
                }
              ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: mode === 'create',
                  whitespace: true,
                  message: 'Password is required!'
                },
                {
                  min: 8,
                  message: 'Password must be at least 8 characters!'
                }
              ]}>
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6} lg={12}>
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

        <div className="mb-4 mt-2 flex w-[240px] flex-col gap-2">
          <Image
            alt="User Image"
            width={240}
            height={210}
            src={imageSrc || userImagePlaceholder}
            loading="lazy"
            className="h-full w-full rounded-md object-cover"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />

          <div className="flex gap-2">
            <Button block onClick={() => setImageSrc(null)}>
              Clear
            </Button>
            <Button
              block
              type="primary"
              className="bg-gray-500 hover:!bg-gray-600"
              onClick={() => fileInputRef.current.click()}>
              Upload
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/user">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
