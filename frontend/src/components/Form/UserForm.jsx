import { Button, Col, Form, Image, Input, Row, Select, TimePicker } from "antd";
import { useRef, useState } from "react";
import userImagePlaceholder from "../../assets/user-placeholder.jpg";
import { Link } from "react-router-dom";

const UserForm = () => {
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

  return (
    <Form
      name="create-user"
      layout="vertical"
      autoComplete="off"
      initialValues={{
        status: 0,
      }}
    >
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items-start">
        <Row gutter={[12, 12]}>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="username"
              label="User Name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "User name is required!",
                },
              ]}
            >
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
                  message: "Email is required!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Password is required!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item name="company" label="Company">
              <Select
                options={[
                  {
                    value: 1,
                    label: "Company 1",
                  },
                  {
                    value: 2,
                    label: "Company 2",
                  },
                  {
                    value: 3,
                    label: "Company 3",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
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
          <Col xs={12} sm={6} md={6} lg={6}>
            <Form.Item name="from_time" label="From Time">
              <TimePicker
                needConfirm={false}
                format="hh:mm A"
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Form.Item name="to_time" label="To Time">
              <TimePicker
                needConfirm={false}
                format="hh:mm A"
                className="w-full"
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
            style={{ display: "none" }}
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
              onClick={() => fileInputRef.current.click()}
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-end items-center">
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
