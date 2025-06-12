/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from 'react';
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { GMS_ADDRESS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import useError from '../../hooks/useError';
import { getProduct } from '../../store/features/productSlice';
import { changeSaleReturnDetailValue } from '../../store/features/saleReturnSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const SaleReturnForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, saleReturnDetail } = useSelector(
    (state) => state.saleReturn
  );

  console.log('initialFormValues', initialFormValues)

  const POType = Form.useWatch('type', form);
  const isBillable = POType === 'Billable';

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const [totalQuantity, setTotalQuantity] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [submitAction, setSubmitAction] = useState(null);

  const onFinish = (values) => {
    if (!totalAmount) return toast.error('Total Amount cannot be zero');

    const data = {
      ...values,
      sale_invoice_id: initialFormValues?.sale_invoice_id ? initialFormValues?.sale_invoice_id : null,
      sale_return_detail: saleReturnDetail.map(({ id, ...detail }) => ({
        ...detail,
        amount: detail.amount ? detail.amount : null,
        quantity: detail.quantity ? detail.quantity : null,
        product_id: detail?.product_id?.value ? detail?.product_id?.value : null,
        unit_id: detail?.unit_id?.value ? detail?.unit_id?.value : null,
      })),
    };

    // return console.log('data' , data)
    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  const onProductChange = async (index, selected) => {
    dispatch(
      changePurchaseInvoiceDetailValue({
        index,
        key: 'product_id',
        value: selected
      })
    );
    if (!selected) return;
    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      dispatch(
        changePurchaseInvoiceDetailValue({
          index,
          key: 'product_code',
          value: product.product_code
        })
      );

      dispatch(
        changePurchaseInvoiceDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changePurchaseInvoiceDetailValue({
          index,
          key: 'rate',
          value: product.cost_price
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const salesmanId = initialFormValues?.salesman_id || '';
      const quantity = initialFormValues?.totalQuantity || '';
      const amount = initialFormValues?.totalAmount || '';
      const customerPoNo = initialFormValues?.customer_po_no || '';
      const eventName = initialFormValues?.event_id || '';
      const vesselName = initialFormValues?.vessel_id || '';
      const customerName = initialFormValues?.customer_id || '';
      const portName = initialFormValues?.port_id || '';
      const refDocumentIdentity = initialFormValues?.ref_document_identity || '';
      const chargeOrderNo = initialFormValues?.charger_order_id || '';
      const status = initialFormValues?.status || '';
      const billingAddress = initialFormValues?.vessel_billing_address ? initialFormValues?.vessel_billing_address : initialFormValues?.vessel?.billing_address || '';
      const shipTo = initialFormValues?.ship_to ? initialFormValues?.ship_to : GMS_ADDRESS || null;
      const shipVia = initialFormValues?.ship_via || '';
      const returnDate = initialFormValues?.return_date === '0000-00-00 00:00:00' ||
        initialFormValues?.return_date === '1899-30-11 00:00:00'
        ? null
        : dayjs(initialFormValues?.return_date);

      setTotalQuantity(quantity);
      setTotalAmount(amount);
      form.setFieldsValue({
        salesman_id: salesmanId,
        totalQuantity: quantity,
        status,
        totalAmount: amount,
        customer_po_no: customerPoNo,
        event_id: eventName,
        vessel_id: vesselName,
        customer_id: customerName,
        charger_order_id: chargeOrderNo,
        port_id: portName,
        ship_to: shipTo,
        return_date: returnDate ? dayjs(returnDate) : null,
        ship_via: shipVia,
        vessel_billing_address: billingAddress,
        ref_document_identity: refDocumentIdentity,
        document_date: initialFormValues.document_date
          ? dayjs(initialFormValues.document_date)
          : null,
        required_date: initialFormValues.required_date
          ? dayjs(initialFormValues.required_date)
          : null
      });
    }
    setTotalQuantity(initialFormValues?.totalQuantity || '');
    setTotalAmount(initialFormValues?.totalAmount || '');
    if (saleReturnDetail?.length > 0) {
      const totalAmt = saleReturnDetail.reduce((acc, item) => {
        return acc + (item.quantity || 0) * (item.rate || 0);
      }, 0);
      const totalQty = saleReturnDetail.reduce((acc, item) => {
        return acc + (parseFloat(item.quantity) || 0);
      }, 0);
      setTotalQuantity(totalQty);
      setTotalAmount(totalAmt);
    }
  }, [initialFormValues, form, mode, saleReturnDetail]);

  const columns = [
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
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (_, record, { product_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/product"
            valueKey="product_id"
            labelKey="product_name"
            labelInValue
            className="w-full"
            disabled
            value={record.product_name}
            onChange={(selected) => onProductChange(index, selected)}
          />
        );
      },
      width: 280
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      render: (_, record, { product_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/product"
            valueKey="product_id"
            labelKey="product_description"
            labelInValue
            disabled
            className="w-full"
            value={record.product_description}
            onChange={(selected) => onProductChange(index, selected)}
          />
        );
      },
      width: 300
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      render: (_, { description }, index) => {
        return (
          <DebounceInput
            disabled
            value={description}
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
        form.setFieldsValue({ [`quantity-${index}`]: quantity });
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${index}`}
            initialValue={quantity}>
            <DebouncedCommaSeparatedInput
              decimalPlaces={2}
              value={quantity}
              onChange={(value) =>
                dispatch(
                  changeSaleReturnDetailValue({
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
            disabled
            labelKey="name"
            labelInValue
            className="w-full"
            value={unit_id}
          />
        );
      },
      width: 120
    },
    {
      title: 'Unit Price',
      dataIndex: 'rate',
      key: 'rate',
      render: (_, { rate }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={rate}
            disabled
          />
        );
      },
      width: 120
    },
    {
      title: 'Ext. Cost',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount, rate, quantity }, index) => {
        const calAmount = (rate || 0) * (quantity || 0);
        return (
          <DebouncedCommaSeparatedInput value={calAmount ? calAmount + '' : ''}
            disabled
            onChange={(value) =>
              dispatch(
                changeSaleReturnDetailValue({
                  index,
                  key: 'amount',
                  value: value
                })
              )
            }
          />
        )
      },
      width: 120
    },
  ];

  return (
    <Form
      name="saleReturn"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      scrollToFirstError>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">Sale Return No:</span>
        <span
          className={`ml-4 text-amber-600 ${mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
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
            label="Sale Return Date"
            disabled>
            <DatePicker format="MM-DD-YYYY" className="w-full" disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={5} lg={5}>
          <Form.Item name="customer_po_no" label="Customer PO No">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={5} lg={5}>
          <Form.Item name="ref_document_identity" label="Quote No">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={5} lg={5}>
          <Form.Item
            name="salesman_id"
            label="Salesman">
            <AsyncSelect
              endpoint="/salesman"
              valueKey="salesman_id"
              labelKey="name"
              disabled
              labelInValue
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="event_id" label="Event">
            <AsyncSelect
              endpoint="/event"
              valueKey="event_id"
              disabled
              labelKey="event_name"
              labelInValue
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="vessel_id" label="Vessel">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="charger_order_id" label="Charge Order No">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="customer_id" label="Customer">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item
            name="port_id"
            label="Port"
            initialValue={
              initialFormValues?.port_id && initialFormValues?.name
                ? { value: initialFormValues.port_id, label: initialFormValues.name }
                : null
            }>
            <AsyncSelect
              endpoint="/port"
              valueKey="port_id"
              labelKey="name"
              labelInValue
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="vessel_billing_address" label="Vessel Billing Address">
            <Input disabled />
          </Form.Item>
        </Col>
        {/* <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="status" label="Status">
            <Select
              size="small"
              className="w-full"
              allowClear
              options={[
                { label: 'Created', value: 'created' },
                { label: 'Return', value: 'return' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={6} lg={6}>
          <Form.Item name="return_date" label="Return Date">
            <DatePicker format="MM-DD-YYYY : HH:mm:ss" showTime className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="ship_to" label="Ship To">
            <Input.TextArea rows={1} />
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
                  value: 'Pickup',
                  label: 'Pickup'
                },
                {
                  value: 'Delivery',
                  label: 'Delivery'
                }
              ]}
              allowClear
            />
          </Form.Item>
        </Col> */}
      </Row>
      <Table
        columns={columns}
        dataSource={saleReturnDetail}
        rowKey={'id'}
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      />

      <div className="rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
        <Row gutter={[12, 12]}>
          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Total Quantity:"
              value={`- ${totalQuantity || 0}`}
            />
            <DetailSummaryInfo
              title="Total Amount:"
              value={`- ${mode === 'edit' && totalAmount ? totalAmount : totalAmount}`}
            />
          </Col>
        </Row>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/sale-return">
          <Button className="w-28">Exit</Button>
        </Link>
        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting && submitAction === 'save'}
          onClick={() => {
            setSubmitAction('save');
            form.submit()
          }}>
          Save
        </Button>
        <Button
          type="primary"
          className="w-28 bg-green-600 hover:!bg-green-500"
          loading={isFormSubmitting && submitAction === 'saveAndExit'}
          onClick={() => {
            setSubmitAction('saveAndExit');
            form.submit();
          }}>
          Save & Exit
        </Button>
      </div>
    </Form>
  );
};

export default SaleReturnForm;
