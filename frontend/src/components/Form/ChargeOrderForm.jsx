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
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useError from "../../hooks/useError";
import {
  addChargeOrderDetail,
  changeChargeOrderDetailOrder,
  changeChargeOrderDetailValue,
  copyChargeOrderDetail,
  removeChargeOrderDetail,
} from "../../store/features/chargeOrderSlice";
import { getEvent } from "../../store/features/eventSlice";
import { getProduct, getProductList } from "../../store/features/productSlice";
import { formatThreeDigitCommas, roundUpto } from "../../utils/number";
import AsyncSelect from "../AsyncSelect";
import DebounceInput from "../Input/DebounceInput";
import DebouncedCommaSeparatedInput from "../Input/DebouncedCommaSeparatedInput";
import { DetailSummaryInfo } from "./QuotationForm";

// eslint-disable-next-line react/prop-types
const ChargeOrderForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, chargeOrderDetails } =
    useSelector((state) => state.chargeOrder);

  const [searchParams] = useSearchParams();

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const quotation_id = searchParams.get("quotation_id") || null;

  let totalQuantity = 0;

  chargeOrderDetails.forEach((detail) => {
    totalQuantity += +detail.quantity || 0;
  });

  const onFinish = (values) => {
    const data = {
      quotation_id,
      remarks: values.remarks,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      customer_id: values.customer_id ? values.customer_id.value : null,
      event_id: values.event_id ? values.event_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      agent_id: values.agent_id ? values.agent_id.value : null,
      document_date: values.document_date
        ? dayjs(values.document_date).format("YYYY-MM-DD")
        : null,
      charge_order_detail: chargeOrderDetails.map(
        // eslint-disable-next-line no-unused-vars
        ({ id, ...detail }, index) => ({
          ...detail,
          supplier_id: detail.supplier_id ? detail.supplier_id.value : null,
          product_id: detail.product_id ? detail.product_id.value : null,
          unit_id: detail.unit_id ? detail.unit_id.value : null,
          sort_order: index,
        })
      ),
      total_quantity: totalQuantity,
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
        changeChargeOrderDetailValue({
          index,
          key: "product_id",
          value: {
            value: product.product_id,
            label: product.name,
          },
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: "unit_id",
          value: { value: product.unit_id, label: product.unit_name },
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onProductChange = async (index, selected) => {
    dispatch(
      changeChargeOrderDetailValue({
        index,
        key: "product_id",
        value: selected,
      })
    );
    if (!selected) return;
    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: "product_code",
          value: product.product_code,
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: "unit_id",
          value: { value: product.unit_id, label: product.unit_name },
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
          onClick={() => dispatch(addChargeOrderDetail())}
        />
      ),
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
                  changeChargeOrderDetailOrder({ from: index, to: index - 1 })
                );
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === chargeOrderDetails.length - 1}
              onClick={() => {
                dispatch(
                  changeChargeOrderDetailOrder({ from: index, to: index + 1 })
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
                changeChargeOrderDetailValue({
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
      width: 560,
    },
    {
      title: "Product Nature",
      dataIndex: "product_type",
      key: "product_type",
      render: (_, { product_type }, index) => {
        return (
          <DebounceInput
            value={product_type}
            onChange={(value) =>
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: "product_type",
                  value: value,
                })
              )
            }
          />
        );
      },
      width: 180,
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
                changeChargeOrderDetailValue({
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
            initialValue={quantity}
            name={`quantity-${uuidv4()}`}
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
                  changeChargeOrderDetailValue({
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
                changeChargeOrderDetailValue({
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
                changeChargeOrderDetailValue({
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
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addChargeOrderDetail())}
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
                onClick: () => dispatch(addChargeOrderDetail(index)),
              },
              {
                key: "2",
                label: "Copy",
                onClick: () => dispatch(copyChargeOrderDetail(index)),
              },
              {
                key: "3",
                label: "Delete",
                danger: true,
                onClick: () => dispatch(removeChargeOrderDetail(id)),
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
      name="chargeOrder"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={mode === "edit" || quotation_id ? initialFormValues : null}
      scrollToFirstError
    >
      {/* Make this sticky */}
      <div className="flex justify-center -mt-8 sticky top-14 z-10">
        <p className="text-xs w-fit border bg-white px-2 rounded p-1 font-semibold">
          <span className="text-gray-500">Charge order No:</span>
          <span
            className={`ml-4 text-amber-600 ${
              mode === "edit"
                ? "hover:bg-slate-200 cursor-pointer"
                : "select-none"
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
            label="Charge Order Date"
            rules={[
              { required: true, message: "charge order date is required" },
            ]}
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
          <Form.Item name="agent_id" label="Agent">
            <AsyncSelect
              endpoint="/agent"
              valueKey="agent_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.agent.list && permissions.agent.add
                  ? "/agent/create"
                  : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={16} lg={16}>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={chargeOrderDetails}
        rowKey="id"
        size="small"
        scroll={{ x: "calc(100% - 200px)", y: 400 }}
        pagination={false}
      />
      <div className="bg-slate-50 rounded-lg border border-t-0 rounded-t-none py-3 px-6 border-slate-300">
        <DetailSummaryInfo
          title="Total Quantity:"
          value={formatThreeDigitCommas(roundUpto(totalQuantity)) || 0}
        />
      </div>

      <div className="mt-4 flex gap-2 justify-end items-center">
        <Link to="/charge-order">
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

export default ChargeOrderForm;
