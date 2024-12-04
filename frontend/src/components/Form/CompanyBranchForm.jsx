import { Button, Col, Form, Image, Input, Row, Select, TimePicker } from "antd";
import { useRef, useState } from "react";
import companyImagePlaceholder from "../../assets/img-placeholder.png";
import { Link } from "react-router-dom";

const CompanyBranchForm = () => {
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
    <Form name="company-branch" layout="vertical" autoComplete="off">
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items-start">
        <Row gutter={[12, 12]} className="w-full">
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="company"
              label="Company"
              rules={[
                {
                  required: true,
                  message: "Company is required!",
                },
              ]}
            >
              <Select
                options={[
                  {
                    value: "Company 1",
                    label: "Company 1",
                  },
                  {
                    value: "Company 2",
                    label: "Company 2",
                  },
                  {
                    value: "Company 3",
                    label: "Company 3",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="branch_code"
              label="Branch Code"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Branch code is required!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item
              name="branch_name"
              label="Branch Name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Branch name is required!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item name="phone_no" label="Phone No">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="address" label="Address">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <div className="mb-4 mt-2 flex w-[234px] flex-col gap-2">
          <Image
            alt="Company Logo"
            width={234}
            height={180}
            src={imageSrc || companyImagePlaceholder}
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
        <Link to="/company-branch">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CompanyBranchForm;
