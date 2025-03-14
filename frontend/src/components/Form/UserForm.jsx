import { Button, Col, Form, Image, Input, Row, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import userImagePlaceholder from '../../assets/user-placeholder.jpg';
import AsyncSelect from '../AsyncSelect';
import UserCompanyTemplates from './UserCompanyTemplates';

// eslint-disable-next-line react/prop-types
const UserForm = ({ mode = 'create', onSubmit }) => {
  const fileInputRef = useRef(null);
  const { isFormSubmitting, initialFormValues, selectedTemplates } = useSelector(
    (state) => state.user
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const [imageSrc, setImageSrc] = useState(initialFormValues?.image_url || null);

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

  const onFinish = (formValues) => {
    const data = {
      ...formValues,
      permission_id: formValues.permission_id.value,
      image: initialFormValues?.image_url === imageSrc ? null : imageSrc,
      from_time: formValues.from_time ? dayjs(formValues.from_time).format('HH:mm:ss') : null,
      to_time: formValues.to_time ? dayjs(formValues.to_time).format('HH:mm:ss') : null,
      company_access: selectedTemplates
    };

    if (
      mode === 'edit' &&
      initialFormValues?.image_url &&
      initialFormValues?.image_url !== imageSrc
    ) {
      data.delete_image = initialFormValues?.image;
    }

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
          : initialFormValues
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
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="User Permission"
              name="permission_id"
              rules={[
                {
                  required: true,
                  message: 'User Permission is required!'
                }
              ]}>
              <AsyncSelect
                endpoint="/permission"
                valueKey="user_permission_id"
                labelKey="name"
                labelInValue
                addNewLink={permissions.user_permission.add ? '/user-permission/create' : null}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
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
          <Col xs={12} sm={6} md={6} lg={6}>
            <Form.Item name="from_time" label="From Time">
              <TimePicker needConfirm={false} format="hh:mm A" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Form.Item name="to_time" label="To Time">
              <TimePicker needConfirm={false} format="hh:mm A" className="w-full" />
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

      <UserCompanyTemplates />

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/user">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
