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
import {
  addQuotationDetail,
  changeQuotationDetailOrder,
  changeQuotationDetailValue,
  copyQuotationDetail,
  removeQuotationDetail,
} from "../../store/features/quotationSlice";
import AsyncSelect from "../AsyncSelect";
import { getEvent } from "../../store/features/eventSlice";
import useError from "../../hooks/useError";

// when product select automatically set product name and id (dropdown), unit, cost price
// when markup or cost price change then calculate rate by using formula (markup/100*cost_price) + cost_price = rate, ;

const QuotationForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
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
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(
                  changeQuotationDetailOrder({ from: index, to: index - 1 })
                );
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === quotationDetails.length - 1}
              onClick={() => {
                dispatch(
                  changeQuotationDetailOrder({ from: index, to: index + 1 })
                );
              }}
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
      render: (_, { id, product_code }) => {
        return (
          <Input
            value={product_code}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "product_code",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 140,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (_, { id, product_name }) => {
        return (
          <Input
            value={product_name}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "product_name",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, { id, description }) => {
        return (
          <Input
            value={description}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "description",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 240,
    },
    {
      title: "Delivery",
      dataIndex: "delivery",
      key: "delivery",
      render: (_, { id, delivery }) => {
        return (
          <Input
            value={delivery}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "delivery",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      render: (_, { id, stock_quantity }) => {
        return <Input value={stock_quantity} disabled />;
      },
      width: 200,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { id, quantity }) => {
        return (
          <Input
            value={quantity}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "quantity",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (_, { id, unit }) => {
        return (
          <Input
            value={unit}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "unit",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (_, { id, vender }) => {
        return (
          <AsyncSelect
            endpoint="/supplier"
            valueKey="supplier_id"
            labelKey="name"
            labelInValue
            className="w-full"
            onChange={(selected) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "supplier_id",
                  value: selected,
                })
              )
            }
            addNewLink="/vendor/create"
          />
        );
      },
      width: 240,
    },
    {
      title: "Cost Price",
      dataIndex: "cost_price",
      key: "cost_price",
      render: (_, { id, cost_price }) => {
        return (
          <Input
            value={cost_price}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "cost_price",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Markup %",
      dataIndex: "markup",
      key: "markup",
      render: (_, { id, markup }) => {
        return (
          <Input
            value={markup}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "markup",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },

    {
      title: "Sale in Price",
      dataIndex: "rate",
      key: "rate",
      render: (_, { id, rate }) => {
        return (
          <Input
            value={rate}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "rate",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, { id, amount }) => {
        return <Input value={amount} disabled />;
      },
      width: 200,
    },
    {
      title: "Discount Percent",
      dataIndex: "discount_percent",
      key: "discount_percent",
      render: (_, { id, discount_percent }) => {
        return (
          <Input
            value={discount_percent}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  id,
                  key: "discount_percent",
                  value: e.target.value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Discount Amount",
      dataIndex: "discount_amount",
      key: "discount_amount",
      render: (_, { id, discount_amount }) => {
        return <Input value={discount_amount} disabled />;
      },
      width: 200,
    },
    {
      title: "Gross Amount",
      dataIndex: "gross_amount",
      key: "gross_amount",
      render: (_, { id, gross_amount }) => {
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
      render: (_, { id }, index) => (
        <Dropdown
          trigger={["click"]}
          arrow
          menu={{
            items: [
              {
                key: "1",
                label: "Add",
                onClick: () => dispatch(addQuotationDetail(index)),
              },
              {
                key: "2",
                label: "Copy",
                onClick: () => dispatch(copyQuotationDetail(index)),
              },
              {
                key: "3",
                label: "Delete",
                danger: true,
                onClick: () => dispatch(removeQuotationDetail(id)),
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

  const onTermChange = (selected) => {
    if (!selected.length) {
      form.setFieldsValue({ term_desc: "" });
      return;
    }

    const newTermDesc = selected.map((t) => `* ${t.label}`).join("\n");
    form.setFieldsValue({ term_desc: newTermDesc });
  };

  const onEventChange = async (selected) => {
    form.setFieldsValue({
      vessel_id: null,
      customer_id: null,
      class1_id: null,
      class2_id: null,
    });

    if (!selected) return;
    try {
      const data = await dispatch(getEvent(selected.value)).unwrap();
      form.setFieldsValue({
        vessel_id: { value: data.vessel_id, label: data.vessel_name },
        customer_id: { value: data.customer_id, label: data.customer_name },
        class1_id: { value: data.class1_id, label: data.class1_name },
        class2_id: { value: data.class2_id, label: data.class2_name },
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="quotation"
      layout="vertical"
      autoComplete="off"
      form={form}
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
          <Form.Item name="salesman_id" label="Salesman">
            <AsyncSelect
              endpoint="/salesman"
              valueKey="salesman_id"
              labelKey="name"
              labelInValue
              addNewLink="/salesman"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="event_id" label="Event">
            <AsyncSelect
              endpoint="/event"
              valueKey="event_id"
              labelKey="event_code"
              labelInValue
              onChange={onEventChange}
              addNewLink="/event/create"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_id" label="Customer">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class1_id" label="Class 1">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class2_id" label="Class 2">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="flag_id" label="Flag">
            <AsyncSelect
              endpoint="/flag"
              valueKey="flag_id"
              labelKey="name"
              labelInValue
              addNewLink="/flag"
            />
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
          <Form.Item name="validity_id" label="Validity">
            <AsyncSelect
              endpoint="/validity"
              valueKey="validity_id"
              labelKey="name"
              labelInValue
              addNewLink="/validity"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="payment_id" label="Payment">
            <AsyncSelect
              endpoint="/payment"
              valueKey="payment_id"
              labelKey="name"
              labelInValue
              addNewLink="/payment"
            />
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
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="term_id" label="Terms & Conditions">
            <AsyncSelect
              endpoint="/terms"
              valueKey="term_id"
              labelKey="name"
              labelInValue
              mode="multiple"
              onChange={(selected) => onTermChange(selected)}
              addNewLink="/terms"
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={16} lg={16}>
          <Form.Item name="term_desc" label="Terms & Conditions">
            <Input.TextArea autoSize />
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
