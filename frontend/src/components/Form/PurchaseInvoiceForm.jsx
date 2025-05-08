/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
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
  addPurchaseInvoiceDetail,
  changePurchaseInvoiceDetailOrder,
  changePurchaseInvoiceDetailValue,
  copyPurchaseInvoiceDetail,
  getPurchaseInvoiceForPrint,
  updatePurchaseInvoice,
  removePurchaseInvoiceDetail
} from '../../store/features/purchaseInvoiceSlice';
import { createPurchaseInvoicePrint } from '../../utils/prints/purchase-invoice-print';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const PurchaseInvoiceForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, purchaseOrderDetails } = useSelector(
    (state) => state.purchaseInvoice
  );

  const [freightRate, setFreightRate] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const POType = Form.useWatch('type', form);
  const isBillable = POType === 'Billable';

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
      buyer_email: values.buyer_email,
      ship_via: values.ship_via,
      department: values.department,
      supplier_id: initialFormValues.supplier_id ? initialFormValues.supplier_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      customer_id: values.customer_id ? values.customer_id.value : null,
      buyer_id: values.buyer_id ? values.buyer_id.value : null,
      event_id: values.event_id ? values.event_id.value : null,
      freight: freightRate,
      payment_id: values.payment_id ? values.payment_id.value : null,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      required_date: values.required_date ? dayjs(values.required_date).format('YYYY-MM-DD') : null,
      purchase_invoice_detail: purchaseOrderDetails.map(({ id, ...detail }, index) => ({
        ...detail,
        product_id: detail.product_id ? detail.product_id.value : null,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        sort_order: index
      })),
      total_amount: totalAmount,
      total_quantity: totalQuantity,
      net_amount: netAmount
    };
    onSubmit(data);
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value })).unwrap();

      if (!res.data.length) return;

      const product = res.data[0];
      dispatch(
        changePurchaseInvoiceDetailValue({
          index,
          key: 'product_id',
          value: {
            value: product.product_id,
            label: product.name
          }
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

  const printPurchaseInvoice = async () => {
    const loadingToast = toast.loading('Loading print...');
    try {
      const data = await dispatch(getPurchaseInvoiceForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createPurchaseInvoicePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const supplierValue = initialFormValues?.supplier_id.label || '';
      const shipVia = initialFormValues?.ship_via || '';
      const shipTo = initialFormValues?.ship_to || '';
      const department = initialFormValues?.department || '';
      form.setFieldsValue({
        supplier_id: supplierValue,
        ship_via: shipVia,
        ship_to: shipTo,
        department: department,
        document_date: initialFormValues.document_date
          ? dayjs(initialFormValues.document_date)
          : null,
        required_date: initialFormValues.required_date
          ? dayjs(initialFormValues.required_date)
          : null
      });
      setFreightRate(initialFormValues.freight || 0);
      setNetAmount(initialFormValues.net_amount || 0);
    }
  }, [initialFormValues, form, mode]);

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addPurchaseInvoiceDetail())}
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
                dispatch(changePurchaseInvoiceDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === purchaseOrderDetails.length - 1}
              onClick={() => {
                dispatch(changePurchaseInvoiceDetailOrder({ from: index, to: index + 1 }));
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
      title: 'Product Name',
      dataIndex: 'product_description',
      key: 'product_description',
      render: (_, record, { product_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/product"
            valueKey="product_id"
            labelKey="product_description"
            labelInValue
            className="w-full"
            value={record.product_description}
            disabled
            onChange={(selected) => onProductChange(index, selected)}
            addNewLink={permissions.product.add ? '/product/create' : null}
          />
        );
      },
      width: 250
    },
    {
      title: 'Description',
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
            value={record.product_name}
            disabled
            onChange={(selected) => onProductChange(index, selected)}
          />
        );
      },
      width: 250
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
            onChange={(value) =>
              dispatch(
                changePurchaseInvoiceDetailValue({
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
      render: (_, { vpart }, index) => {
        return (
          <DebounceInput
            disabled
            value={vpart}
            onChange={(value) =>
              dispatch(
                changePurchaseInvoiceDetailValue({
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
              decimalPlaces={2}
              value={quantity}
              disabled
              onChange={(value) =>
                dispatch(
                  changePurchaseInvoiceDetailValue({
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
            onChange={(selected) =>
              dispatch(
                changePurchaseInvoiceDetailValue({
                  index,
                  key: 'unit_id',
                  value: selected
                })
              )
            }
          />
        );
      },
      width: 120
    },
    {
      title: 'Po Price',
      dataIndex: 'po_price',
      key: 'po_price',
      render: (_, { po_price }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={po_price}
            disabled
            onChange={(value) =>
              dispatch(
                changePurchaseInvoiceDetailValue({
                  index,
                  key: 'po_price',
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
      title: 'Unit Price',
      dataIndex: 'rate',
      key: 'rate',
      render: (_, { rate }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={rate}
            onChange={(value) =>
              dispatch(
                changePurchaseInvoiceDetailValue({
                  index,
                  key: 'rate',
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
      title: 'Vendor Notes',
      dataIndex: 'vendor_notes',
      key: 'vendor_notes',
      render: (_, { vendor_notes }, index) => {
        return (
          <DebounceInput
            disabled
            value={vendor_notes}
            onChange={(value) =>
              dispatch(
                changePurchaseInvoiceDetailValue({
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
      title: 'Received Date',
      dataIndex: 'grn_date',
      key: 'grn_date',
      render: (_, { grn_date }) => (
        <DatePicker
          value={grn_date ? dayjs(grn_date) : null}
          format="MM-DD-YYYY"
          disabled
          style={{ width: '100%' }}
        />
      ),
      width: 150
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addPurchaseInvoiceDetail())}
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
                onClick: () => dispatch(addPurchaseInvoiceDetail(index))
              },
              {
                key: '2',
                label: 'Copy',
                onClick: () => dispatch(copyPurchaseInvoiceDetail(index))
              },
              {
                key: '3',
                label: 'Delete',
                danger: true,
                onClick: () => dispatch(removePurchaseInvoiceDetail(id))
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
      name="purchaseInvoice"
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
        <span className="text-gray-500">Purchase Invoice No:</span>
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
            label="Purchase Invoice Date"
            rules={[{ required: true, message: 'Purchase Invoice date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="required_date"
            label="Required Date"
            rules={[{ required: true, message: 'Required date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="supplier_id" label="Vendor">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="ship_via" label="Ship Via">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="department" label="Department">
            <Input disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="ship_to" label="Ship To">
            <Input.TextArea rows={1} disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vendor_invoice_no" label="Vendor Invoice No">
            <Input />
          </Form.Item>
        </Col>
      </Row>

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
        <Row gutter={[16, 16]}>
          <Col span={24} sm={12} md={8} lg={6}>
            <DetailSummaryInfo title="Total Quantity:" value={totalQuantity} />
            <DetailSummaryInfo title="Total Amount:" value={totalAmount} />
            <DetailSummaryInfo
              title="Freight Rate:"
              value={
                <DebouncedCommaSeparatedInput
                  value={freightRate}
                  type="decimal"
                  size="small"
                  className="w-20"
                  onChange={(value) => setFreightRate(value)}
                  decimalPlaces={2}
                />
              }
            />
            {/* <DetailSummaryInfo title="Net Amount:" value={parseInt(totalAmount) + parseInt(freightRate) || 0} /> */}
            <DetailSummaryInfo
              title="Net Amount:"
              value={netAmount > 0 ? netAmount : parseInt(totalAmount) + parseInt(freightRate) || 0}
            />
          </Col>
        </Row>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/purchase-invoice">
          <Button className="w-28">Cancel</Button>
        </Link>
        {/* {mode === 'edit' ? (
          <Button
            type="primary"
            className="w-28 bg-rose-600 hover:!bg-rose-500"
            onClick={printPurchaseInvoice}>
            Print
          </Button>
        ) : null} */}
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

export default PurchaseInvoiceForm;
