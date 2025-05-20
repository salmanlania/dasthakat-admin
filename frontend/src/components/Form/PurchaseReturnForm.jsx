/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import useError from '../../hooks/useError';
import { getProduct } from '../../store/features/productSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const PurchaseReturnForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, purchaseReturnDetail, list } = useSelector(
    (state) => state.purchaseReturn
  );

  // useEffect(()=>{
    console.log('initialFormValues' , initialFormValues)
  // })

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
      vessel_billing_address: values?.vessel_billing_address ? values?.vessel_billing_address : null
    };

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
      // const billingAddress = initialFormValues?.vessel || '';
      const billingAddress = initialFormValues?.vessel_billing_address ? initialFormValues?.vessel_billing_address : initialFormValues?.vessel?.billing_address || '';

      setTotalQuantity(quantity);
      setTotalAmount(amount);
      form.setFieldsValue({
        salesman_id: salesmanId,
        totalQuantity: quantity,
        totalAmount: amount,
        customer_po_no: customerPoNo,
        event_id: eventName,
        vessel_id: vesselName,
        customer_id: customerName,
        charger_order_id: chargeOrderNo,
        port_id: portName,
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
  }, [initialFormValues, form, mode]);

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
            initialValue={quantity}
            rules={[
              {
                required: true,
                message: 'Quantity is required'
              }
            ]}>
            <DebouncedCommaSeparatedInput
              disabled
              decimalPlaces={2}
              value={quantity}
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
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} disabled />
      ),
      width: 120
    },
  ];

  return (
    <Form
      name="purchaseReturn"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={
        mode === 'edit'
          ? {
            ...initialFormValues
          }
          : { document_date: dayjs() }
      }
      scrollToFirstError>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">Sale Invoice No:</span>
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
            label="Sale Invoice Date"
            disabled
            rules={[{ required: true, message: 'charge order date is required' }]}>
            <DatePicker format="MM-DD-YYYY" className="w-full" />
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
            label="Salesman"
            rules={[{ required: true, message: 'Salesman is required' }]}>
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
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_billing_address" label="Vessel Billing Address">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {/* <Table
        columns={columns}
        dataSource={saleInvoiceDetail}
        rowKey={'charge_order_detail_id'}
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      /> */}

      <div className="rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
        <Row gutter={[12, 12]}>
          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Total Quantity:"
              value={totalQuantity || 0}
            />
            <DetailSummaryInfo
              title="Total Amount:"
              value={totalAmount || 0}
            />
          </Col>
        </Row>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/sale-invoice">
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

export default PurchaseReturnForm;
