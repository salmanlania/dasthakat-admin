/* eslint-disable react/prop-types */
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
import { v4 as uuidv4 } from "uuid";
import useError from "../../hooks/useError";
import { getEvent } from "../../store/features/eventSlice";
import { getProduct, getProductList } from "../../store/features/productSlice";
import {
  addQuotationDetail,
  changeQuotationDetailOrder,
  changeQuotationDetailValue,
  copyQuotationDetail,
  removeQuotationDetail,
  setRebatePercentage,
  setSalesmanPercentage,
} from "../../store/features/quotationSlice";
import { getSalesman } from "../../store/features/salesmanSlice";
import { formatThreeDigitCommas, roundUpto } from "../../utils/number";
import AsyncSelect from "../AsyncSelect";
import DebouncedCommaSeparatedInput from "../Input/DebouncedCommaSeparatedInput";
import DebouncedNumberInput from "../Input/DebouncedNumberInput";
import DebounceInput from "../Input/DebounceInput";

export const DetailSummaryInfo = ({ title, value }) => {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-sm text-gray-500 ml-1">{title}</span>
      {value}
    </div>
  );
};

const QuotationForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const {
    isFormSubmitting,
    initialFormValues,
    quotationDetails,
    rebatePercentage,
    salesmanPercentage,
  } = useSelector((state) => state.quotation);

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

  const rebateAmount =
    rebatePercentage && totalNet
      ? formatThreeDigitCommas(roundUpto(totalNet * (rebatePercentage / 100)))
      : 0;

  const salesmanAmount =
    salesmanPercentage && totalNet
      ? formatThreeDigitCommas(roundUpto(totalNet * (salesmanPercentage / 100)))
      : 0;

  const finalAmount =
    roundUpto((totalNet || 0) - (rebateAmount || 0) - (salesmanAmount || 0)) ||
    0;

  const onFinish = (values) => {
    if (!totalNet) return toast.error("Net Amount cannot be zero");
    if (rebatePercentage > 100)
      return toast.error("Rebate Percentage cannot be greater than 100");
    if (salesmanPercentage > 100)
      return toast.error("Salesman Percentage cannot be greater than 100");

    const data = {
      attn: values.attn,
      delivery: values.delivery,
      customer_ref: values.customer_ref,
      imo: values.imo,
      internal_notes: values.internal_notes,
      term_desc: values.term_desc,
      class1_id: values.class1_id ? values.class1_id.value : null,
      port_id: values.port_id ? values.port_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      customer_id: values.customer_id ? values.customer_id.value : null,
      event_id: values.event_id ? values.event_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      person_incharge_id: values.person_incharge_id
        ? values.person_incharge_id.value
        : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      validity_id: values.validity_id ? values.validity_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
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
      total_quantity: totalQuantity,
      total_discount: discountAmount,
      total_amount: totalAmount,
      net_amount: totalNet,
      rebate_percent: rebatePercentage,
      salesman_percent: salesmanPercentage,
      rebate_amount: rebateAmount,
      salesman_amount: salesmanAmount,
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
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addQuotationDetail())}
        />
      ),
      key: "order",
      dataIndex: "order",
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
      width: 50,
    },
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
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
      width: 120,
    },
    {
      title: "Description",
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
      width: 560,
    },
    {
      title: "Customer Notes",
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
      width: 122,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { quantity }, index) => {
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${uuidv4()}`}
            initialValue={quantity}
            rules={[
              {
                required: true,
                message: "Quantity is required",
              },
            ]}
          >
            <DebouncedCommaSeparatedInput
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
          </Form.Item>
        );
      },
      width: 100,
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
      width: 120,
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
          <DebouncedCommaSeparatedInput
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
      width: 120,
    },
    {
      title: "Markup %",
      dataIndex: "markup",
      key: "markup",
      render: (_, { markup }, index) => {
        return (
          <Form.Item
            className="m-0"
            initialValue={markup}
            name={`markup-${uuidv4()}`}
            rules={[
              {
                validator: (_, value) => {
                  if (value > 100) {
                    return Promise.reject(new Error("Invalid markup."));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DebouncedNumberInput
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
          </Form.Item>
        );
      },
      width: 90,
    },

    {
      title: "Selling Price",
      dataIndex: "rate",
      key: "rate",
      render: (_, { rate }, index) => {
        return (
          <Form.Item
            className="m-0"
            name={`rate-${uuidv4()}`}
            initialValue={rate}
            rules={[
              {
                required: true,
                message: "Selling price is required",
              },
            ]}
          >
            <DebouncedCommaSeparatedInput
              value={rate}
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
          </Form.Item>
        );
      },
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput
          value={amount ? amount + "" : ""}
          disabled
        />
      ),
      width: 120,
    },
    {
      title: "Discount %",
      dataIndex: "discount_percent",
      key: "discount_percent",
      render: (_, { discount_percent }, index) => {
        return (
          <Form.Item
            className="m-0"
            initialValue={discount_percent}
            name={`discount_percent-${uuidv4()}`}
            rules={[
              {
                validator: (_, value) => {
                  if (value > 100) {
                    return Promise.reject(
                      new Error("Invalid discount percent.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DebouncedNumberInput
              value={discount_percent}
              type="decimal"
              onChange={(value) =>
                dispatch(
                  changeQuotationDetailValue({
                    index,
                    key: "discount_percent",
                    value: value,
                  })
                )
              }
            />
          </Form.Item>
        );
      },
      width: 100,
    },
    {
      title: "Discount Amt",
      dataIndex: "discount_amount",
      key: "discount_amount",
      render: (_, { discount_amount }) => {
        return (
          <DebouncedCommaSeparatedInput
            value={discount_amount ? discount_amount + "" : ""}
            disabled
          />
        );
      },
      width: 120,
    },
    {
      title: "Gross Amount",
      dataIndex: "gross_amount",
      key: "gross_amount",
      render: (_, { gross_amount }) => {
        return (
          <DebouncedCommaSeparatedInput
            value={gross_amount ? gross_amount + "" : ""}
            disabled
          />
        );
      },
      width: 150,
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
      imo: null,
      class1_id: null,
      class2_id: null,
      flag_id: null,
    });
    dispatch(setRebatePercentage(null));

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
        payment_id: { value: data.payment_id, label: data.payment_name },
      });
      dispatch(
        setRebatePercentage(data.rebate_percent ? +data.rebate_percent : null)
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onSalesmanChange = async (selected) => {
    dispatch(setSalesmanPercentage(null));
    if (!selected) return;

    try {
      const data = await dispatch(getSalesman(selected.value)).unwrap();
      dispatch(
        setSalesmanPercentage(
          data.commission_percentage ? +data.commission_percentage : null
        )
      );
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
      initialValues={
        mode === "edit"
          ? initialFormValues
          : {
              document_date: dayjs(),
            }
      }
      scrollToFirstError
    >
      {/* Make this sticky */}
      <div className="flex justify-center -mt-8 sticky top-14 z-10">
        <p className="text-xs w-fit border bg-white px-2 rounded p-1 font-semibold">
          <span className="text-gray-500">Quotation No:</span>
          <span
            className={`ml-4 text-amber-600 ${
              mode === "edit" ? "hover:bg-slate-200 cursor-pointer" : ""
            } px-1 rounded`}
            onClick={() => {
              if (mode !== "edit") return;
              navigator.clipboard.writeText(
                initialFormValues.document_identity
              );
              toast.success("Copied");
            }}
          >
            {mode === "edit" ? initialFormValues.document_identity : "AUTO"}
          </span>
        </p>
      </div>
      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="document_date"
            label="Quotation Date"
            rules={[{ required: true, message: "Quotation date is required" }]}
            className="w-full"
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
              onChange={onSalesmanChange}
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
              labelKey="event_name"
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
          <Form.Item name="person_incharge_id" label="Person Incharge">
            <AsyncSelect
              endpoint="/user"
              valueKey="user_id"
              labelKey="user_name"
              labelInValue
              addNewLink={
                permissions.user.list && permissions.user.add
                  ? "/user/create"
                  : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_ref" label="Customer Ref">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="due_date" label="Due Date" className="w-full">
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
          <Form.Item name="payment_id" label="Payment Terms">
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
          <Form.Item name="internal_notes" label="Internal Notes">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="port_id" label="Port">
            <AsyncSelect
              endpoint="/port"
              valueKey="port_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.port.list && permissions.port.add ? "/port" : null
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="p-4 border border-slate-300 bg-slate-50 rounded-lg">
        <div className="flex md:flex-row flex-col justify-between items-center py-2">
          <h5 className="text-base font-medium">Terms & Conditions</h5>
          <Form.Item name="term_id" className="w-full md:w-96 p-0 m-0">
            <AsyncSelect
              endpoint="/terms"
              valueKey="term_id"
              labelKey="name"
              placeholder="Select Terms"
              labelInValue
              mode="multiple"
              maxTagCount="responsive"
              onChange={(selected) => onTermChange(selected)}
              addNewLink={
                permissions.terms.list && permissions.terms.add
                  ? "/terms"
                  : null
              }
            />
          </Form.Item>
        </div>

        <Form.Item name="term_desc" className="mb-3">
          <Input.TextArea
            autoSize={{
              minRows: 2,
            }}
            rows={2}
          />
        </Form.Item>
      </div>

      <Divider orientation="left" className="!border-gray-300">
        Quotation Items
      </Divider>

      <Table
        columns={columns}
        dataSource={quotationDetails}
        rowKey={"id"}
        size="small"
        scroll={{ x: "calc(100% - 200px)" }}
        pagination={false}
        sticky={{
          offsetHeader: 56,
        }}
      />

      <div className="bg-slate-50 rounded-lg border border-t-0 rounded-t-none py-3 px-6 border-slate-300">
        <Row gutter={[12, 12]}>
          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Total Quantity:"
              value={formatThreeDigitCommas(roundUpto(totalQuantity)) || 0}
            />
          </Col>

          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Total Amount:"
              value={formatThreeDigitCommas(roundUpto(totalAmount)) || 0}
            />
          </Col>

          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Discount Amount:"
              value={formatThreeDigitCommas(roundUpto(discountAmount)) || 0}
            />
          </Col>

          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Net Amount:"
              value={formatThreeDigitCommas(roundUpto(totalNet)) || 0}
            />
          </Col>
        </Row>
        <Row gutter={[12, 12]} className="mb-4">
          <Col span={24} sm={12}>
            <h4 className="font-medium text-gray-800 mt-2 ml-1">Rebate:</h4>
            <div className="flex gap-4">
              <DetailSummaryInfo
                title="Percentage:"
                value={
                  <DebouncedNumberInput
                    type="decimal"
                    size="small"
                    className="w-20"
                    value={rebatePercentage}
                    onChange={(value) => dispatch(setRebatePercentage(value))}
                  />
                }
              />
              <DetailSummaryInfo title="Amount:" value={rebateAmount} />
            </div>
          </Col>
          <Col span={24} sm={12}>
            <h4 className="font-medium text-gray-800 mt-2 ml-1">Salesman:</h4>
            <div className="flex gap-4">
              <DetailSummaryInfo
                title="Percentage:"
                value={
                  <DebouncedNumberInput
                    type="decimal"
                    size="small"
                    className="w-20"
                    value={salesmanPercentage}
                    onChange={(value) => dispatch(setSalesmanPercentage(value))}
                  />
                }
              />
              <DetailSummaryInfo title="Amount:" value={salesmanAmount} />
            </div>
          </Col>
        </Row>

        <DetailSummaryInfo title="Final Amount:" value={finalAmount} />
      </div>

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
