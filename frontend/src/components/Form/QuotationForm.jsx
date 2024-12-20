import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  Row,
  Select,
  Table,
} from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useError from "../../hooks/useError";
import { getEvent } from "../../store/features/eventSlice";
import { getProduct, getProductList } from "../../store/features/productSlice";
import {
  addQuotationDetail,
  changeQuotationDetailOrder,
  changeQuotationDetailValue,
  copyQuotationDetail,
  removeQuotationDetail,
} from "../../store/features/quotationSlice";
import { formatThreeDigitCommas, roundUpto } from "../../utils/number";
import AsyncSelect from "../AsyncSelect";
import AmountSummaryCard from "../Card/AmountSummaryCard";
import CommaSeparatedInput from "../Input/CommaSepratedInput";
import DebounceInput from "../Input/DebounceInput";
import NumberInput from "../Input/NumberInput";

// eslint-disable-next-line react/prop-types
const QuotationForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, quotationDetails } = useSelector(
    (state) => state.quotation
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  let totalQuantity = 0;
  let totalAmount = 0;
  let discountAmount = 0;
  let totalNet = 0;

  quotationDetails.forEach((detail) => {
    totalQuantity += +detail.quantity || 0;
    totalAmount += +detail.amount || 0;
    discountAmount += +detail.discount_amount || 0;
    totalNet += +detail.gross_amount || 0;
  });

  const onFinish = (values) => {
    if (!totalNet) return toast.error("Net Amount cannot be zero");

    const data = {
      ...values,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      customer_id: values.customer_id ? values.customer_id.value : null,
      event_id: values.event_id ? values.event_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      validity_id: values.validity_id ? values.validity_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      dated: values.dated ? dayjs(values.dated).format("YYYY-MM-DD") : null,
      document_date: values.document_date
        ? dayjs(values.document_date).format("YYYY-MM-DD")
        : null,
      due_date: values.due_date
        ? dayjs(values.due_date).format("YYYY-MM-DD")
        : null,
      term_id:
        values.term_id && values.term_id.length
          ? values.term_id.map((v) => v.value)
          : null,
      // eslint-disable-next-line no-unused-vars
      quotation_detail: quotationDetails.map(({ id, ...detail }, index) => ({
        ...detail,
        supplier_id: detail.supplier_id ? detail.supplier_id.value : null,
        product_id: detail.product_id ? detail.product_id.value : null,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        sort_order: index,
      })),
      total_quantity: totalAmount,
      total_discount: discountAmount,
      total_amount: totalAmount,
      net_amount: totalNet,
    };

    onSubmit(data);
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(
        getProductList({ product_code: value })
      ).unwrap();

      if (!res.data.length) return;

      const product = res.data[0];
      dispatch(
        changeQuotationDetailValue({
          index,
          key: "product_id",
          value: {
            value: product.product_id,
            label: product.name,
          },
        })
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: "unit_id",
          value: { value: product.unit_id, label: product.unit_name },
        })
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: "cost_price",
          value: product.cost_price,
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onProductChange = async (index, selected) => {
    dispatch(
      changeQuotationDetailValue({
        index,
        key: "product_id",
        value: selected,
      })
    );
    if (!selected) return;
    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      dispatch(
        changeQuotationDetailValue({
          index,
          key: "product_code",
          value: product.product_code,
        })
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: "unit_id",
          value: { value: product.unit_id, label: product.unit_name },
        })
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: "cost_price",
          value: product.cost_price,
        })
      );
    } catch (error) {
      handleError(error);
    }
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
      render: (_, { product_code }, index) => {
        return (
          <DebounceInput
            value={product_code}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "product_code",
                  value: value,
                })
              )
            }
            onBlur={(e) => onProductCodeChange(index, e.target.value)}
            onPressEnter={(e) => onProductCodeChange(index, e.target.value)}
          />
        );
      },
      width: 140,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (_, { product_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/product"
            valueKey="product_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={product_id}
            onChange={(selected) => onProductChange(index, selected)}
            addNewLink={
              permissions.product.list && permissions.product.add
                ? "/product/create"
                : null
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
      render: (_, { description }, index) => {
        return (
          <DebounceInput
            value={description}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "description",
                  value: value,
                })
              )
            }
          />
        );
      },
      width: 240,
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
      render: (_, { quantity }, index) => {
        return (
          <CommaSeparatedInput
            decimalPlaces={2}
            value={quantity}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "quantity",
                  value: value,
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
      dataIndex: "unit_id",
      key: "unit_id",
      render: (_, { unit_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/unit"
            valueKey="unit_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={unit_id}
            onChange={(selected) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "unit_id",
                  value: selected,
                })
              )
            }
            addNewLink={
              permissions.unit.list && permissions.unit.add ? "/unit" : null
            }
          />
        );
      },
      width: 200,
    },
    {
      title: "Vendor",
      dataIndex: "supplier_id",
      key: "supplier_id",
      render: (_, { supplier_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/supplier"
            valueKey="supplier_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={supplier_id}
            onChange={(selected) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "supplier_id",
                  value: selected,
                })
              )
            }
            addNewLink={
              permissions.supplier.list && permissions.supplier.add
                ? "/vendor/create"
                : null
            }
          />
        );
      },
      width: 240,
    },
    {
      title: "Cost Price",
      dataIndex: "cost_price",
      key: "cost_price",
      render: (_, { cost_price }, index) => {
        return (
          <CommaSeparatedInput
            value={cost_price}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "cost_price",
                  value: value,
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
      render: (_, { markup }, index) => {
        return (
          <NumberInput
            value={markup ? markup + "" : ""}
            type="decimal"
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "markup",
                  value: value,
                })
              )
            }
          />
        );
      },
      width: 200,
    },

    {
      title: "Selling Price",
      dataIndex: "rate",
      key: "rate",
      render: (_, { rate }, index) => {
        return (
          <CommaSeparatedInput
            value={rate ? rate + "" : ""}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: "rate",
                  value: value,
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
      render: (_, { amount }) => (
        <CommaSeparatedInput value={amount ? amount + "" : ""} disabled />
      ),
      width: 200,
    },
    {
      title: "Discount Percent",
      dataIndex: "discount_percent",
      key: "discount_percent",
      render: (_, { discount_percent }, index) => {
        return (
          <Input
            value={discount_percent}
            onChange={(e) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
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
      render: (_, { discount_amount }) => {
        return (
          <CommaSeparatedInput
            value={discount_amount ? discount_amount + "" : ""}
            disabled
          />
        );
      },
      width: 200,
    },
    {
      title: "Gross Amount",
      dataIndex: "gross_amount",
      key: "gross_amount",
      render: (_, { gross_amount }) => {
        return (
          <CommaSeparatedInput
            value={gross_amount ? gross_amount + "" : ""}
            disabled
          />
        );
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
      flag_id: null,
    });

    if (!selected) return;
    try {
      const data = await dispatch(getEvent(selected.value)).unwrap();
      form.setFieldsValue({
        vessel_id: { value: data.vessel_id, label: data.vessel_name },
        imo: data.imo,
        customer_id: { value: data.customer_id, label: data.customer_name },
        class1_id: { value: data.class1_id, label: data.class1_name },
        class2_id: { value: data.class2_id, label: data.class2_name },
        flag_id: { value: data.flag_id, label: data.flag_name },
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
      initialValues={mode === "edit" ? initialFormValues : null}
      scrollToFirstError
    >
      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="document_no" label="Document No">
            <Input disabled placeholder="Auto" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="document_date"
            label="Document Date"
            rules={[{ required: true, message: "Document date is required" }]}
          >
            <DatePicker format="DD-MM-YYYY" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="salesman_id"
            label="Salesman"
            rules={[{ required: true, message: "Salesman is required" }]}
          >
            <AsyncSelect
              endpoint="/salesman"
              valueKey="salesman_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.salesman.list && permissions.salesman.add
                  ? "/salesman"
                  : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="event_id"
            label="Event"
            rules={[{ required: true, message: "Event is required" }]}
          >
            <AsyncSelect
              endpoint="/event"
              valueKey="event_id"
              labelKey="event_code"
              labelInValue
              onChange={onEventChange}
              addNewLink={
                permissions.event.list && permissions.event.add
                  ? "/event/create"
                  : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="imo" label="IMO">
            <Input disabled />
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
              disabled
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
          <Form.Item name="delivery" label="Delivery">
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
              addNewLink={
                permissions.validity.list && permissions.validity.add
                  ? "/validity"
                  : null
              }
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
              addNewLink={
                permissions.payment.list && permissions.payment.add
                  ? "/payment"
                  : null
              }
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
              addNewLink={
                permissions.terms.list && permissions.terms.add
                  ? "/terms"
                  : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={16} lg={16}>
          <Form.Item name="term_desc" label="Terms & Conditions">
            <Input.TextArea autoSize />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!border-gray-300">
        Quotation Items
      </Divider>

      <Table
        columns={columns}
        dataSource={quotationDetails}
        rowKey="id"
        size="small"
        scroll={{ x: "calc(100% - 200px)", y: 400 }}
        pagination={false}
      />

      <Row gutter={[16, 16]} className="mt-2">
        <Col span={24} sm={12} md={8} lg={6}>
          <AmountSummaryCard
            title="Total Quantity"
            value={formatThreeDigitCommas(roundUpto(totalQuantity))}
          />
        </Col>
        <Col span={24} sm={12} md={8} lg={6}>
          <AmountSummaryCard
            title="Total Amount"
            value={formatThreeDigitCommas(roundUpto(totalAmount))}
          />
        </Col>
        <Col span={24} sm={12} md={8} lg={6}>
          <AmountSummaryCard
            title="Discount Amount"
            value={formatThreeDigitCommas(roundUpto(discountAmount))}
          />
        </Col>
        <Col span={24} sm={12} md={8} lg={6}>
          <AmountSummaryCard
            title="Net Amount"
            value={formatThreeDigitCommas(roundUpto(totalNet))}
          />
        </Col>
      </Row>

      <div className="mt-4 flex gap-2 justify-end items-center">
        <Link to="/quotation">
          <Button className="w-28">Cancel</Button>
        </Link>
        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting}
          onClick={() => form.submit()}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default QuotationForm;
