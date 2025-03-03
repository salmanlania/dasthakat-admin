/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { GMS_ADDRESS } from '../../constants';
import useError from '../../hooks/useError';
import { purchaseOrderTypes } from '../../pages/PurchaseOrder';
import { getProduct, getProductList } from '../../store/features/productSlice';
import {
  addPurchaseOrderDetail,
  changePurchaseOrderDetailOrder,
  changePurchaseOrderDetailValue,
  copyPurchaseOrderDetail,
  getPurchaseOrderForPrint,
  removePurchaseOrderDetail,
  resetPurchaseOrderDetail
} from '../../store/features/purchaseOrderSlice';
import { getVendor } from '../../store/features/vendorSlice';
import { createPurchaseOrderPrint } from '../../utils/prints/purchase-order-print';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const PurchaseOrderForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, purchaseOrderDetails } = useSelector(
    (state) => state.purchaseOrder
  );

  const POType = Form.useWatch('type', form);
  const isBuyout = POType === 'Buyout';

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  let totalAmount = 0;
  let totalQuantity = 0;

  purchaseOrderDetails.forEach((detail) => {
    totalAmount += +detail.amount || 0;
    totalQuantity += +detail.quantity || 0;
  });

  const onFinish = (values) => {
    if (!totalAmount) return toast.error('Total Amount cannot be zero');

    const data = {
      type: values.type,
      remarks: values.remarks,
      ship_to: values.ship_to,
      buyer_name: values.buyer_name,
      yer_email: values.buyer_email,
      ship_via: values.ship_via,
      supplier_id: values.supplier_id ? values.supplier_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      buyer_id: values.buyer_id ? values.buyer_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      quotation_id: initialFormValues?.quotation_id,
      charge_order_id: initialFormValues?.charge_order_id,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      required_date: values.required_date ? dayjs(values.required_date).format('YYYY-MM-DD') : null,
      purchase_order_detail: purchaseOrderDetails.map(({ id, ...detail }, index) => ({
        ...detail,
        product_id: detail.product_type_id?.value == 4 ? null : detail.product_id.value,
        product_name: detail.product_type_id?.value == 4 ? detail.product_name : null,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        product_type_id: detail.product_type_id ? detail.product_type_id.value : null,
        sort_order: index
      })),
      total_amount: totalAmount,
      total_quantity: totalQuantity
    };

    onSubmit(data);
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value, stock: true })).unwrap();

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
          key: 'product_type_id',
          value: product.product_type_id
            ? {
                value: product.product_type_id,
                label: product.product_type_name
              }
            : null
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
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

    if (!selected) {
      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'product_code',
          value: null
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'product_type',
          value: null
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'unit_id',
          value: null
        })
      );

      return;
    }

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
          key: 'product_type_id',
          value: product.product_type_id
            ? {
                value: product.product_type_id,
                label: product.product_type_name
              }
            : null
        })
      );

      dispatch(
        changePurchaseOrderDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onVendorChange = async (selected) => {
    if (!selected) return;

    try {
      const { payment } = await dispatch(getVendor(selected.value)).unwrap();

      if (payment) {
        form.setFieldsValue({
          payment_id: {
            value: payment.payment_id,
            label: payment.name
          }
        });
      }
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
      title: 'Product Type',
      dataIndex: 'product_type',
      key: 'product_type',
      render: (_, { product_code, product_type_id, editable }, index) => {
        return (
          <AsyncSelectNoPaginate
            endpoint="/lookups/product-types"
            valueKey="product_type_id"
            labelKey="name"
            disabled={editable === false}
            labelInValue
            className="w-full"
            value={product_type_id}
            onChange={(selected) => {
              dispatch(resetPurchaseOrderDetail(index));
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'product_type_id',
                  value: selected
                })
              );
            }}
          />
        );
      },
      width: 150
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      render: (_, { product_code, product_type_id, editable }, index) => {
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
            disabled={product_type_id?.value == 4 || editable === false}
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
      render: (_, { product_id, product_name, product_type_id, editable }, index) => {
        return product_type_id?.value == 4 ? (
          <Form.Item
            className="m-0"
            name={`product_name-${index}`}
            initialValue={product_name}
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Description is required'
              }
            ]}>
            <DebounceInput
              value={product_name}
              disabled={editable === false}
              onChange={(value) =>
                dispatch(
                  changePurchaseOrderDetailValue({
                    index,
                    key: 'product_name',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
        ) : (
          <AsyncSelect
            endpoint="/product"
            valueKey="product_id"
            labelKey="product_name"
            labelInValue
            className="w-full"
            disabled={editable === false}
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
      render: (_, { description, editable }, index) => {
        return (
          <DebounceInput
            value={description}
            disabled={editable === false}
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
      title: 'V.Part#',
      dataIndex: 'vpart',
      key: 'vpart',
      render: (_, { vpart, editable }, index) => {
        return (
          <DebounceInput
            value={vpart}
            disabled={editable === false}
            onChange={(value) =>
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'vpart',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 100
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, { quantity, editable }, index) => {
        form.setFieldsValue({ [`quantity-${index}`]: quantity });
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${index}`}
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
              disabled={editable === false}
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
      render: (_, { unit_id, product_type_id, editable }, index) => {
        return (
          <AsyncSelect
            endpoint="/unit"
            valueKey="unit_id"
            labelKey="name"
            disabled={product_type_id?.value != 4 || editable === false}
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
      dataIndex: 'rate',
      key: 'rate',
      render: (_, { rate, editable }, index) => {
        form.setFieldsValue({ [`rate-${index}`]: rate });
        return (
          <Form.Item
            className="m-0"
            name={`rate-${index}`}
            initialValue={rate}
            rules={[
              {
                required: true,
                message: 'Selling price is required'
              }
            ]}>
            <DebouncedCommaSeparatedInput
              value={rate}
              disabled={editable === false}
              onChange={(value) =>
                dispatch(
                  changePurchaseOrderDetailValue({
                    index,
                    key: 'rate',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
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
      dataIndex: 'vendor_notes',
      key: 'vendor_notes',
      render: (_, { vendor_notes, editable }, index) => {
        return (
          <DebounceInput
            value={vendor_notes}
            disabled={editable === false}
            onChange={(value) =>
              dispatch(
                changePurchaseOrderDetailValue({
                  index,
                  key: 'vendor_notes',
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
              type: 'Inventory',
              ship_to: GMS_ADDRESS
            }
      }
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        scrollMode: 'always'
      }}>
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
              onChange={onVendorChange}
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
            name="type"
            label="Purchase Order Type"
            rules={[
              {
                required: true,
                message: 'Purchase Order Type is required'
              }
            ]}>
            <Select disabled options={purchaseOrderTypes} />
          </Form.Item>
        </Col>

        {isBuyout ? (
          <>
            <Col span={24} sm={12} md={8} lg={8} className="flex gap-3">
              <Form.Item name="charge_no" label="Charge No" className="w-full">
                <Input disabled />
              </Form.Item>

              <Form.Item name="purchase_order_no" label="Purchase Order No" className="w-full">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="event_id" label="Event">
                <Select labelInValue disabled />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="customer_id" label="Customer">
                <Select labelInValue disabled />
              </Form.Item>
            </Col>
          </>
        ) : null}

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="payment_id" label="Payment Terms">
            <AsyncSelect
              endpoint="/payment"
              valueKey="payment_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.payment.list && permissions.payment.add ? '/payment' : null}
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="ship_via" label="Ship Via">
            <Select
              options={[
                {
                  value: 'Courier',
                  label: 'Courier'
                },
                {
                  value: 'Delivery',
                  label: 'Delivery'
                },
                {
                  value: 'Will Call',
                  label: 'Will Call'
                }
              ]}
              allowClear
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="buyer_id" label="Buyer">
            <AsyncSelect
              endpoint="/user"
              valueKey="user_id"
              labelKey="user_name"
              labelInValue
              addNewLink={permissions.user.list && permissions.user.add ? '/user/create' : null}
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="ship_to" label="Ship To">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>

        <Col span={24}>
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

      <div className="flex flex-wrap gap-4 rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
        <DetailSummaryInfo title="Total Quantity:" value={totalQuantity} />
        <DetailSummaryInfo title="Total Amount:" value={totalAmount} />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/purchase-order">
          <Button className="w-28">Cancel</Button>
        </Link>
        {mode === 'edit' ? (
          <Button
            type="primary"
            className="w-28 bg-rose-600 hover:!bg-rose-500"
            onClick={printPurchaseOrder}>
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
