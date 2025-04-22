import { Button, Col, Form, Image, Input, Row, Select } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import productImagePlaceholder from '../../assets/img-placeholder.png';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate.jsx';
import CommaSeparatedInput from '../Input/CommaSeparatedInput';

// eslint-disable-next-line react/prop-types
const ProductForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const { isFormSubmitting, initialFormValues } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const [imageSrc, setImageSrc] = useState(initialFormValues?.image_url || null);

  const categoryID = Form.useWatch('category_id', form);

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
      product_type_id: formValues.product_type_id ? formValues.product_type_id.value : null,
      category_id: formValues.category_id ? formValues.category_id.value : null,
      sub_category_id: formValues.sub_category_id ? formValues.sub_category_id.value : null,
      brand_id: formValues.brand_id ? formValues.brand_id.value : null,
      unit_id: formValues.unit_id ? formValues.unit_id.value : null,
      image: initialFormValues?.image_url === imageSrc ? null : imageSrc
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
      name="product"
      layout="vertical"
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      initialValues={mode === 'edit' ? initialFormValues : { status: 1 }}>
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items-start">
        <div>
          <Row gutter={[12, 12]} className="w-full">
            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="product_code" label="Code">
                <Input disabled placeholder="Auto" />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item
                name="product_type_id"
                label="Type"
                rules={[{ required: true, message: 'Type is required' }]}>
                <AsyncSelectNoPaginate
                  endpoint="/lookups/product-types"
                  valueKey="product_type_id"
                  labelKey="name"
                  params={{
                    include_other: 0
                  }}
                  labelInValue
                />
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
                    message: 'Name is required'
                  }
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="impa_code" label="IMPA Code">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="category_id" label="Category">
                <AsyncSelect
                  endpoint="/category"
                  valueKey="category_id"
                  labelKey="name"
                  labelInValue
                  onChange={() => form.setFieldsValue({ sub_category_id: null })}
                  addNewLink={
                    permissions.category.list && permissions.category.add ? '/category' : null
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="sub_category_id" label="Sub Category">
                <AsyncSelect
                  disabled={!categoryID}
                  endpoint="/sub-category"
                  valueKey="sub_category_id"
                  labelKey="name"
                  labelInValue
                  params={{ category_id: categoryID ? categoryID.value : null }}
                  dependencies={[categoryID]}
                  addNewLink={
                    permissions.sub_category.list && permissions.sub_category.add
                      ? '/sub-category'
                      : null
                  }
                />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="brand_id" label="Brand">
                <AsyncSelect
                  endpoint="/brand"
                  valueKey="brand_id"
                  labelKey="name"
                  labelInValue
                  addNewLink={permissions.brand.list && permissions.brand.add ? '/brand' : null}
                />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item
                name="unit_id"
                label="Unit"
                rules={[{ required: true, message: 'Unit is required' }]}>
                <AsyncSelect
                  endpoint="/unit"
                  valueKey="unit_id"
                  labelKey="name"
                  labelInValue
                  addNewLink={permissions.unit.list && permissions.unit.add ? '/unit' : null}
                />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="cost_price" label="Cost Price">
                <CommaSeparatedInput />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="sale_price" label="Sale Price">
                <CommaSeparatedInput />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="status" label="Status">
                <Select
                  options={[
                    { value: 1, label: 'Active' },
                    { value: 0, label: 'Inactive' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item
                name="short_code"
                label="Short Code"
                >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="mb-4 mt-2 flex w-[234px] flex-col gap-2">
          <Image
            alt="Product Logo"
            width={234}
            height={180}
            src={imageSrc || productImagePlaceholder}
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
        <Link to="/product">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" className="w-28" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;
