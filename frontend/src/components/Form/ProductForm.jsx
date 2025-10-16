// import { Button, Col, Form, Image, Input, Row, Select, Tabs, Typography } from 'antd';
// import { useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import productImagePlaceholder from '../../assets/img-placeholder.png';
// import AsyncSelect from '../AsyncSelect';
// import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate.jsx';
// import AsyncSelectProduct from '../AsyncSelectProduct/index.jsx';
// import CommaSeparatedInput from '../Input/CommaSeparatedInput';

// const { TabPane } = Tabs;
// const { Title } = Typography;
// // eslint-disable-next-line react/prop-types
// const ProductForm = ({ mode, onSubmit }) => {
//   const [form] = Form.useForm();
//   const fileInputRef = useRef(null);

//   const [activeTab, setActiveTab] = useState('1');
//   const [imageSrc, setImageSrc] = useState(null);

//   const categoryID = Form.useWatch('category_id', form);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageSrc(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onFinish = (formValues) => {
//     const data = {
//       ...formValues,
//       product_type_id: formValues.product_type_id ? formValues.product_type_id.value : null,
//       category_id: formValues.category_id ? formValues.category_id.value : null,
//       sub_category_id: formValues.sub_category_id ? formValues.sub_category_id.value : null,
//       brand_id: formValues.brand_id ? formValues.brand_id.value : null,
//       unit_id: formValues.unit_id ? formValues.unit_id.value : null,
//       // image: initialFormValues?.image_url === imageSrc ? null : imageSrc
//       image: imageSrc
//     };

//     // if (
//     //   mode === 'edit' &&
//     //   initialFormValues?.image_url &&
//     //   initialFormValues?.image_url !== imageSrc
//     // ) {
//     //   data.delete_image = initialFormValues?.image;
//     // }

//     onSubmit(data);
//   };

//   return (
//     <Form
//       name="product"
//       layout="vertical"
//       form={form}
//       autoComplete="off"
//       onFinish={onFinish}
//       initialValues={mode === 'edit' ? 'initialFormValues' : { status: 1 }}
//     >
//       <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row md:items-start">
//         <Row gutter={[12, 12]} className="w-full">
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="product_code" label="Code">
//               <Input disabled placeholder="Auto" />
//             </Form.Item>
//           </Col>
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item
//               name="product_type_id"
//               label="Type"
//               rules={[{ required: true, message: 'Type is required' }]}>
//               <AsyncSelectNoPaginate
//                 endpoint="/lookups/product-types"
//                 valueKey="product_type_id"
//                 labelKey="name"
//                 params={{
//                   include_other: 0
//                 }}
//                 labelInValue
//               />
//             </Form.Item>
//           </Col>
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[
//                 {
//                   required: true,
//                   whitespace: true,
//                   message: 'Name is required'
//                 }
//               ]}>
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="impa_code" label="IMPA Code">
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="category_id" label="Category">
//               <AsyncSelect
//                 endpoint="/category"
//                 valueKey="category_id"
//                 labelKey="name"
//                 labelInValue
//                 onChange={() => form.setFieldsValue({ sub_category_id: null })}
//                 addNewLink='/category'
//               />
//             </Form.Item>
//           </Col>
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="sub_category_id" label="Sub Category">
//               <AsyncSelect
//                 disabled={!categoryID}
//                 endpoint="/sub-category"
//                 valueKey="sub_category_id"
//                 labelKey="name"
//                 labelInValue
//                 params={{ category_id: categoryID ? categoryID.value : null }}
//                 dependencies={[categoryID]}
//                 addNewLink='/sub-category'
//               />
//             </Form.Item>
//           </Col>

//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="brand_id" label="Brand">
//               <AsyncSelect
//                 endpoint="/brand"
//                 valueKey="brand_id"
//                 labelKey="name"
//                 labelInValue
//                 addNewLink='/brand'
//               />
//             </Form.Item>
//           </Col>

//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item
//               name="unit_id"
//               label="Unit"
//               rules={[{ required: true, message: 'Unit is required' }]}>
//               <AsyncSelect
//                 endpoint="/unit"
//                 valueKey="unit_id"
//                 labelKey="name"
//                 labelInValue
//                 addNewLink='/unit'
//               />
//             </Form.Item>
//           </Col>

//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="cost_price" label="Cost Price">
//               <CommaSeparatedInput />
//             </Form.Item>
//           </Col>

//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="sale_price" label="Sale Price">
//               <CommaSeparatedInput />
//             </Form.Item>
//           </Col>

//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item name="status" label="Status">
//               <Select
//                 options={[
//                   { value: 1, label: 'Active' },
//                   { value: 0, label: 'Inactive' }
//                 ]}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={24} sm={12} md={8} lg={8}>
//             <Form.Item
//               name="short_code"
//               label="Short Code"
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//         </Row>
//         <div className="mb-4 mt-2 flex w-[234px] flex-col gap-2">
//           <Image
//             alt="Product Logo"
//             width={234}
//             height={180}
//             src={imageSrc || productImagePlaceholder}
//             loading="lazy"
//             className="h-full w-full rounded-md object-cover"
//           />

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             style={{ display: 'none' }}
//             ref={fileInputRef}
//           />

//           <div className="flex gap-2">
//             <Button block onClick={() => setImageSrc(null)}>
//               Clear
//             </Button>
//             <Button
//               block
//               type="primary"
//               className="bg-gray-500 hover:!bg-gray-600"
//               onClick={() => fileInputRef.current.click()}>
//               Upload
//             </Button>
//           </div>
//         </div>
//       </div>
//       <div className="mt-4 flex items-center justify-end gap-2">
//         <Link to="/product">
//           <Button className="w-28">Cancel</Button>
//         </Link>
//         <Button type="primary" htmlType="submit" className="w-28">
//           Save
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default ProductForm;
import { Button, Col, Form, Image, Input, Row, Select, Typography } from 'antd';
import { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'; // Plus icon for upload

const { Title } = Typography;

const ProductForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState([]); // Store uploaded image sources

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileReaders = files.map((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc((prev) => [...prev, reader.result]); // Add new image to the array
        };
        reader.readAsDataURL(file);
        return reader;
      });
    }
  };

  const handleDeleteSingleImage = (index) => {
    const updatedImages = imageSrc.filter((_, idx) => idx !== index);
    setImageSrc(updatedImages);
  };

  const handleClearAllImages = () => {
    setImageSrc([]);
  };

  const handleFinish = (formValues) => {
    const data = {
      ...formValues,
      images: imageSrc, // Include uploaded images
    };
    onSubmit(data);
  };

  return (
    <Form
      name="product"
      layout="vertical"
      form={form}
      autoComplete="off"
      onFinish={handleFinish}
      initialValues={mode === 'edit' ? 'initialFormValues' : { status: 1 }}
    >
      {/* Image Upload Section */}
      {/* <div className="mb-10">
        <Row gutter={[16, 16]} justify="start">
          {imageSrc.length < 1 ? (
            <Col span={6}>
              <div className="relative">
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => fileInputRef.current.click()}
                  className="absolute top-0 right-0 bg-white"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontSize: '20px',
                  }}
                />
              </div>
            </Col>
          ) : (
            imageSrc.map((src, index) => (
              <Col span={6} key={index}>
                <div className="relative">
                  <Image
                    alt={`Product Image ${index + 1}`}
                    src={src}
                    width={100}
                    height={100}
                    className="rounded-md"
                    preview={false}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => fileInputRef.current.click()}
                    className="absolute top-0 right-0 bg-white"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      fontSize: '20px',
                    }}
                  />
                </div>
              </Col>
            ))
          )}
        </Row>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
          multiple
        />
      </div> */}
      <div className="form-container mb-12">
        <div className="image-upload-section">
          <Row gutter={[16, 16]} justify="start">
            {/* If no images uploaded, show Plus icon */}
            {imageSrc.length < 1 ? (
              <Col span={6}>
                <div className="ant-upload">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => fileInputRef.current.click()}
                    className="ant-upload-button"
                  />
                </div>
              </Col>
            ) : (
              // Display uploaded images
              imageSrc.map((src, index) => (
                <Col span={6} key={index}>
                  <div className="ant-upload">
                    <img
                      src={src}
                      alt={`Uploaded Image ${index + 1}`}
                      className="ant-upload-list-item-thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => fileInputRef.current.click()}
                      className="ant-upload-button"
                    />
                  </div>
                </Col>
              ))
            )}
          </Row>

          {/* Hidden file input for image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
            multiple
          />
        </div>
      </div>
      {/* Form Fields */}
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
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Input />
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
                message: 'Name is required',
              },
            ]}
          >
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
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="sub_category_id" label="Sub Category">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="brand_id" label="Brand">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="unit_id"
            label="Unit"
            rules={[{ required: true, message: 'Unit is required' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="cost_price" label="Cost Price">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="sale_price" label="Sale Price">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { value: 1, label: 'Active' },
                { value: 0, label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="short_code" label="Short Code">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      {/* Submit Button */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button className="w-28">Cancel</Button>
        <Button type="primary" htmlType="submit" className="w-28">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;
