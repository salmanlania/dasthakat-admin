import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Row,
  Select,
  Table,
} from "antd";
import { BiPlus } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addQuotationDetail } from "../../store/features/quotationSlice";

// when product select automatically set product name and id (dropdown), unit, cost price
// when markup or cost price change then calculate rate by using formula (markup/100*cost_price) + cost_price = rate, ;

const QuotationForm = ({ mode, onSubmit }) => {
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, quotationDetails } = useSelector(
    (state) => state.quotation
  );

  const onFinish = (formValues) => {
    const data = {
      ...formValues,
    };

    // onSubmit(data);
  };

  const columns = [
    {
      key: "order",
      dataIndex: "order",
      fixed: "left",
      render: (_, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
            />
          </div>
        );
      },
      width: 40,
    },
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 40,
    },
    {
      title: "Product Code",
      dataIndex: "product_code",
      key: "product_code",
      render: (_, { product_code }) => {
        return <Input value={product_code} />;
      },
      width: 140,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (_, { product_name }) => {
        return <Input value={product_name} />;
      },
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, { description }) => {
        return <Input value={description} />;
      },
      width: 240,
    },
    {
      title: "Delivery",
      dataIndex: "delivery",
      key: "delivery",
      render: (_, { delivery }) => {
        return <Input value={delivery} />;
      },
      width: 200,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      render: (_, { stock_quantity }) => {
        return <Input value={stock_quantity} disabled />;
      },
      width: 200,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { quantity }) => {
        return <Input value={quantity} />;
      },
      width: 200,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (_, { unit }) => {
        return <Input value={unit} />;
      },
      width: 200,
    },
    {
      title: "Vender",
      dataIndex: "vender",
      key: "vender",
      render: (_, { vender }) => {
        return <Select value={vender} className="w-full" />;
      },
      width: 240,
    },
    {
      title: "Cost Price",
      dataIndex: "cost_price",
      key: "cost_price",
      render: (_, { cost_price }) => {
        return <Input value={cost_price} />;
      },
      width: 200,
    },
    {
      title: "Markup %",
      dataIndex: "markup",
      key: "markup",
      render: (_, { markup }) => {
        return <Input value={markup} />;
      },
      width: 200,
    },

    {
      title: "Sale in Price",
      dataIndex: "rate",
      key: "rate",
      render: (_, { rate }) => {
        return <Input value={rate} />;
      },
      width: 200,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, { amount }) => {
        return <Input value={amount} disabled />;
      },
      width: 200,
    },
    {
      title: "Discount Percent",
      dataIndex: "discount_percent",
      key: "discount_percent",
      render: (_, { discount_percent }) => {
        return <Input value={discount_percent} />;
      },
      width: 200,
    },
    {
      title: "Discount Amount",
      dataIndex: "discount_amount",
      key: "discount_amount",
      render: (_, { discount_amount }) => {
        return <Input value={discount_amount} disabled />;
      },
      width: 200,
    },
    {
      title: "Gross Amount",
      dataIndex: "gross_amount",
      key: "gross_amount",
      render: (_, { gross_amount }) => {
        return <Input value={gross_amount} disabled />;
      },
      width: 200,
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addQuotationDetail())}
        />
      ),
      key: "action",
      render: (_, { id }) => (
        <Dropdown
          trigger={["click"]}
          arrow
          menu={{
            items: [
              {
                key: "1",
                label: "Add",
              },
              {
                key: "2",
                label: "Copy",
              },
              {
                key: "3",
                label: "Delete",
                danger: true,
              },
            ],
          }}
        >
          <Button size="small">
            <BsThreeDotsVertical />
          </Button>
        </Dropdown>
      ),
      width: 50,
      fixed: "right",
    },
  ];

  return (
    <Form
      name="quotation"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      initialValues={initialFormValues}
    >
      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="document_no" label="Document No">
            <Input disabled placeholder="Auto" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="document_date" label="Document Date">
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="salesman" label="Salesman">
            <Input />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="event" label="Event">
            {/* <AsyncSelect
                endpoint="/currency"
                valueKey="currency_id"
                labelKey="name"
                labelInValue
              /> */}
            <Select />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel" label="Vessel">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer" label="Customer">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="flag" label="Flag">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class1" label="Class 1">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class2" label="Class 2">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_ref" label="Customer Ref">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="dated" label="Dated">
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="due_date" label="Due Date">
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="attn" label="Attn">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="delivery_date" label="Delivery">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="validity" label="Validity">
            <Select />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="payment" label="Payment">
            <Select />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="inclosure" label="Inclosure">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="port" label="Port">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={16} lg={16}>
          <Form.Item name="terms_and_conditions" label="Terms & Conditions">
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={quotationDetails}
        rowKey="id"
        size="small"
        scroll={{ x: "calc(100% - 200px)", y: 220 }}
        pagination={false}
      />

      <div className="mt-4 flex justify-end gap-2 flex-wrap items-center">
        <Form.Item name="total_quantity" label="Total Quantity">
          <Input disabled className="w-40" />
        </Form.Item>
        <Form.Item name="total_amount" label="Total Amount">
          <Input disabled className="w-40" />
        </Form.Item>
        <Form.Item name="discount_amount" label="Discount Amount">
          <Input disabled className="w-40" />
        </Form.Item>
        <Form.Item name="total_net" label="Total Net">
          <Input disabled className="w-40" />
        </Form.Item>
      </div>

      <div className="mt-4 flex gap-2 justify-end items-center">
        <Link to="/quotation">
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

export default QuotationForm;
