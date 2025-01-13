/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useError from '../../hooks/useError';
import { getProduct, getProductList } from '../../store/features/productSlice';
import {
  addPurchaseOrderDetail,
  changePurchaseOrderDetailOrder,
  changePurchaseOrderDetailValue,
  copyPurchaseOrderDetail,
  getPurchaseOrderForPrint,
  removePurchaseOrderDetail
} from '../../store/features/purchaseOrderSlice';
import { createPurchaseOrderPrint } from '../../utils/prints/purchase-order-print';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const PurchaseOrderForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    isFormSubmitting,
    initialFormValues,
    purchaseOrderDetails,
    rebatePercentage,
    salesmanPercentage
  } = useSelector((state) => state.purchaseOrder);

  const POType = Form.useWatch('po_type', form);
  const isBillable = POType === 'Billable';

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  let totalNet = 0;

  purchaseOrderDetails.forEach((detail) => {
    totalNet += +detail.gross_amount || 0;
  });

  const onFinish = (values) => {
    if (!totalNet) return toast.error('Net Amount cannot be zero');
    if (rebatePercentage > 100) return toast.error('Rebate Percentage cannot be greater than 100');
    if (salesmanPercentage > 100)
      return toast.error('Salesman Percentage cannot be greater than 100');

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
      person_incharge_id: values.person_incharge_id ? values.person_incharge_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      validity_id: values.validity_id ? values.validity_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : null,
      term_id: values.term_id && values.term_id.length ? values.term_id.map((v) => v.value) : null,

      purchaseOrder_detail: purchaseOrderDetails.map(({ id, ...detail }, index) => ({
        ...detail,
        supplier_id: detail.supplier_id ? detail.supplier_id.value : null,
        product_id: detail.product_id ? detail.product_id.value : null,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        sort_order: index
      })),
      total_quantity: totalQuantity,
      total_discount: discountAmount,
      total_amount: totalAmount,
      net_amount: totalNet,
      rebate_percent: rebatePercentage,
      salesman_percent: salesmanPercentage,
      rebate_amount: rebateAmount,
      salesman_amount: salesmanAmount
    };

    // onSubmit(data);
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value })).unwrap();

      if (!res.data.length) return;

      const product = res.data[0];
      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'product_id',
          value: {
            value: product.product_id,
            label: product.name
          }
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onProductChange = async (index, selected) => {
    dispatch(
      changePurchaseOrderDetailValue({
        index,
        key: 'product_id',
        value: selected
      })
    );
    if (!selected) return;
    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'product_code',
          value: product.product_code
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const printPurchaseOrder = async () => {
    const loadingToast = toast.loading('Loading print...');
    try {
      const data = await dispatch(getPurchaseOrderForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createPurchaseOrderPrint(data);
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
          onClick={() => dispatch(addPurchaseOrderDetail())}
        />
      ),
      key: 'order',
      dataIndex: 'order',
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(changePurchaseOrderDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === purchaseOrderDetails.length - 1}
              onClick={() => {
                dispatch(changePurchaseOrderDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      render: (_, { product_code }, index) => {
        return (
          <DebounceInput
            value={product_code}
            onChange={(value) =>
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'product_code',
                  value: value
                })
              )
            }
            onBlur={(e) => onProductCodeChange(index, e.target.value)}
            onPressEnter={(e) => onProductCodeChange(index, e.target.value)}
          />
        );
      },
      width: 120
    },
    {
      title: 'Description',
      dataIndex: 'product_name',
      key: 'product_name',
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
              permissions.product.list && permissions.product.add ? '/product/create' : null
            }
          />
        );
      },
      width: 560
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      render: (_, { description }, index) => {
        return (
          <DebounceInput
            value={description}
            onChange={(value) =>
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'description',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 240
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, { quantity }, index) => {
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${uuidv4()}`}
            initialValue={quantity}
            rules={[
              {
                required: true,
                message: 'Quantity is required'
              }
            ]}>
            <DebouncedCommaSeparatedInput
              decimalPlaces={2}
              value={quantity}
              onChange={(value) =>
                dispatch(
                  changePurchaseOrderDetailValue({
                    index,
                    key: 'quantity',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
        );
      },
      width: 100
    },
    {
      title: 'Unit',
      dataIndex: 'unit_id',
      key: 'unit_id',
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
                changePurchaseOrderDetailValue({
                  index,
                  key: 'unit_id',
                  value: selected
                })
              )
            }
            addNewLink={permissions.unit.list && permissions.unit.add ? '/unit' : null}
          />
        );
      },
      width: 120
    },
    {
      title: 'Unit Price',
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (_, { cost_price }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={cost_price}
            onChange={(value) =>
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'cost_price',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 120
    },
    {
      title: 'Ext. Cost',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} disabled />
      ),
      width: 120
    },
    {
      title: 'Vend Notes',
      dataIndex: 'vend_notes',
      key: 'vend_notes',
      render: (_, { vend_notes }, index) => {
        return (
          <DebounceInput
            value={vend_notes}
            onChange={(value) =>
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'vend_notes',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 240
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addPurchaseOrderDetail())}
        />
      ),
      key: 'action',
      render: (_, { id }, index) => (
        <Dropdown
          trigger={['click']}
          arrow
          menu={{
            items: [
              {
                key: '1',
                label: 'Add',
                onClick: () => dispatch(addPurchaseOrderDetail(index))
              },
              {
                key: '2',
                label: 'Copy',
                onClick: () => dispatch(copyPurchaseOrderDetail(index))
              },
              {
                key: '3',
                label: 'Delete',
                danger: true,
                onClick: () => dispatch(removePurchaseOrderDetail(id))
              }
            ]
          }}>
          <Button size="small">
            <BsThreeDotsVertical />
          </Button>
        </Dropdown>
      ),
      width: 50,
      fixed: 'right'
    }
  ];

  return (
    <Form
      name="purchaseOrder"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={
        mode === 'edit'
          ? initialFormValues
          : {
              document_date: dayjs(),
              po_type: 'Inventory'
            }
      }
      scrollToFirstError>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">Purchase Order No:</span>
        <span
          className={`ml-4 text-amber-600 ${
            mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
          } rounded px-1`}
          onClick={() => {
            if (mode !== 'edit') return;
            navigator.clipboard.writeText(initialFormValues?.document_identity);
            toast.success('Copied');
          }}>
          {mode === 'edit' ? initialFormValues?.document_identity : 'AUTO'}
        </span>
      </p>
      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="document_date"
            label="Purchase Order Date"
            rules={[{ required: true, message: 'Purchase Order date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="required_date"
            label="Required Date"
            rules={[{ required: true, message: 'Required date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="supplier_id" label="Vendor">
            <AsyncSelect
              endpoint="/supplier"
              valueKey="supplier_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.supplier.list && permissions.supplier.add ? '/vendor/create' : null
              }
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="po_type"
            label="Purchase Order Type"
            rules={[
              {
                required: true,
                message: 'Purchase Order Type is required'
              }
            ]}>
            <Select
              options={[
                {
                  value: 'Inventory',
                  label: 'Inventory'
                },
                {
                  value: 'Billable',
                  label: 'Billable'
                }
              ]}
            />
          </Form.Item>
        </Col>

        {isBillable ? (
          <>
            <Col span={24} sm={12} md={8} lg={8} className="flex gap-3">
              <Form.Item name="charge_no" label="Charge No" className="w-full">
                <Input disabled />
              </Form.Item>

              <Form.Item name="quotation_no" label="Quotation No" className="w-full">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="event_id" label="Event">
                <AsyncSelect
                  endpoint="/event"
                  valueKey="event_id"
                  labelKey="name"
                  labelInValue
                  disabled
                  addNewLink={
                    permissions.event.list && permissions.event.add ? '/event/create' : null
                  }
                />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="customer_id" label="Customer">
                <AsyncSelect
                  endpoint="/customer"
                  valueKey="customer_id"
                  labelKey="name"
                  labelInValue
                  disabled
                  addNewLink={
                    permissions.customer.list && permissions.customer.add
                      ? '/customer/create'
                      : null
                  }
                />
              </Form.Item>
            </Col>
          </>
        ) : null}

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="validity_id" label="Payment Terms">
            <AsyncSelect
              endpoint="/validity"
              valueKey="validity_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.validity.list && permissions.validity.add ? '/validity' : null
              }
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!border-gray-300">
        Purchase Order Items
      </Divider>

      <Table
        columns={columns}
        dataSource={purchaseOrderDetails}
        rowKey={'id'}
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      />

      <div className="rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
        <DetailSummaryInfo title="Net Amount:" value={totalNet} />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/purchase-order">
          <Button className="w-28">Cancel</Button>
        </Link>
        {mode === 'edit' ? (
          <Button
            type="primary"
            className="w-28 bg-rose-600 hover:!bg-rose-500"
            // onClick={printPurchaseOrder}
          >
            Print
          </Button>
        ) : null}
        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting}
          onClick={() => form.submit()}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default PurchaseOrderForm;
