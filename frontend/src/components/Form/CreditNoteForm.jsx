/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Form, Input, Row, Spin, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useError from '../../hooks/useError';
import { clearCreditNoteList, setCreditNoteListParams } from '../../store/features/creditNoteSlice';
import { clearSaleInvoiceDetail, getSaleInvoice } from '../../store/features/saleInvoiceSlice';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectProduct from '../AsyncSelectProduct';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebouncedCommaSeparatedInputRate from '../Input/DebouncedCommaSeparatedInputRate';
import DebounceInput from '../Input/DebounceInput';

const CreditNoteForm = ({ mode, onSubmit, onSave }) => {
  const handleError = useError();
  const [form] = Form.useForm();
  const eventId = Form.useWatch('event_id', form);
  const isEventSelected = !!eventId;
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.creditNote
  );

  const { saleInvoiceDetail, isItemLoading } = useSelector(
    (state) => state.saleInvoice
  );

  const [submitAction, setSubmitAction] = useState(null);
  const [eventsId, setEventsId] = useState();
  useEffect(() => {
    setEventsId(eventId);
  }, [eventId]);

  const onFinish = (values) => {
    const data = {
      ...initialFormValues,
      ...values,
      document_date: values?.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      credit_percent: values?.credit_percent ? parseFloat(values.credit_percent) : 0,
      credit_amount: values?.credit_amount ? parseFloat(values.credit_amount) : 0,
      credit_total_amount: values?.credit_total_amount ? parseFloat(values.credit_total_amount) : 0,
      event_id: values?.event_id ? values?.event_id?.value : null,
      sale_invoice_id: values?.sale_invoice_id ? values?.sale_invoice_id?.value : null,
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      setEventsId(initialFormValues?.event_id?.value)
      const id = initialFormValues?.saleInvoiceId || initialFormValues?.sale_invoice_id?.value;
      if (id) {
        try {
          dispatch(getSaleInvoice(id)).unwrap();
        } catch (error) {
          handleError(error);
        }
      }
      form.setFieldsValue({
        credit_total_amount: initialFormValues?.credit_total_amount ? initialFormValues?.credit_total_amount : '',
        credit_percent: initialFormValues?.credit_percent ? initialFormValues?.credit_percent : '',
        credit_amount: initialFormValues?.credit_amount ? initialFormValues?.credit_amount : '',
      });
    }

    const newEvent = !eventsId && !initialFormValues?.event_id?.value
    if (newEvent) {
      dispatch(setCreditNoteListParams({}));
      dispatch(clearCreditNoteList())
      form.setFieldsValue({
        credit_total_amount: '',
        credit_percent: '',
        credit_amount: ''
      });
    }
  }, [initialFormValues, form, mode]);

  const handleCreditPercentageChange = (value) => {
    const percentage = parseFloat(value) || 0;
    const total = parseFloat(form.getFieldValue('credit_total_amount')) || 0;
    const amount = ((percentage / 100) * total).toFixed(2);
    form.setFieldsValue({ credit_amount: amount });
  };

  const handleCreditAmountChange = (value) => {
    const amount = parseFloat(value) || 0;
    const total = parseFloat(form.getFieldValue('credit_total_amount')) || 0;
    const percentage = total ? ((amount / total) * 100).toFixed(2) : 0;
    form.setFieldsValue({ credit_percent: percentage });
  };

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
      title: 'P. Type',
      dataIndex: 'product_type_id',
      key: 'product_type_id',
      render: (_, record, index) => {
        const fullValue = record.product_type_id?.label.toString() || '';
        const shortKey = fullValue.substring(0, 2);
        return (
          <DebounceInput
            disabled
            value={shortKey}
          />
        );
      },
      width: 70
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
            className="text-right"
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
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} className="text-right" disabled />
      ),
      width: 120
    },
    {
      title: 'Dis %',
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      render: (_, { discount_percent }) => (
        <DebouncedCommaSeparatedInput value={discount_percent ? discount_percent + '' : '0'} disabled />
      ),
      width: 120
    },
    {
      title: 'Discount Amt',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      render: (_, { discount_amount }) => (
        <DebouncedCommaSeparatedInput value={discount_amount ? discount_amount + '' : '0'} className="text-right" disabled />
      ),
      width: 120
    },
    {
      title: 'Gross Amount',
      dataIndex: 'gross_amount',
      key: 'gross_amount',
      render: (_, record, { gross_amount }) => {
        const extCost = Number(record?.amount)
        const disAmount = Number(record?.discount_amount)
        const grossAmount = extCost - disAmount
        return (
          <DebouncedCommaSeparatedInput value={gross_amount ? gross_amount : grossAmount ? grossAmount : "0"} className="text-right" disabled />
        )
      },
      width: 120
    },
  ];

  return (
    <Form
      name="creditNote"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={
        mode === 'edit'
          ? {
            ...initialFormValues,
            document_date: initialFormValues?.document_date
              ? dayjs(initialFormValues.document_date)
              : null,
          }
          : { document_date: dayjs() }
      }
      scrollToFirstError>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">Credi Note No:</span>
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
        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item
            name="document_date"
            label="Credit Note Date"
          >
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item
            name="document_no"
            label="Credit Note No"
          >
            <Input className="w-full" disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item name="event_id" label="Event">
            <AsyncSelect
              key={id}
              endpoint="/event"
              valueKey="event_id"
              labelKey="event_name"
              labelInValue
              onChange={(value) => {
                form.setFieldsValue({
                  sale_invoice_id: null,
                  credit_total_amount: '',
                  credit_percent: '',
                  credit_amount: ''
                });

                dispatch(clearSaleInvoiceDetail());

                if (value) {
                  dispatch(setCreditNoteListParams({ event_id: value.value }));
                } else {
                  dispatch(setCreditNoteListParams({}));
                  dispatch(clearSaleInvoiceDetail());
                }
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item name="sale_invoice_id" label="Sale Invoice">
            <AsyncSelectProduct
              key={uuidv4()}
              endpoint={`/sale-invoice${eventsId ? `?event_id=${eventsId.value}` : ''}`}
              valueKey="sale_invoice_id"
              labelKey="document_identity"
              disabled={!isEventSelected}
              labelInValue
              onChange={(options, value) => {
                dispatch(clearSaleInvoiceDetail());
                const id = options?.value;
                if (id) {
                  try {
                    dispatch(getSaleInvoice(id)).unwrap();
                  } catch (error) {
                    handleError(error);
                  }
                } else {
                  dispatch(clearSaleInvoiceDetail());
                }
                const total = value?.total_amount ? value.total_amount : 0;
                form.setFieldsValue({
                  credit_total_amount: total,
                  credit_percent: '',
                  credit_amount: ''
                });
                dispatch(setCreditNoteListParams({ sale_invoice_id: value?.value }));
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item
            name="credit_total_amount"
            label="Sale Invoice Amount"
          >
            <Input className="w-full text-right" disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item
            name="credit_percent"
            label="Credit Percentage"
          >
            <DebouncedCommaSeparatedInputRate
              className="w-full"
              onChange={handleCreditPercentageChange}
              disabled={!isEventSelected}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={8} md={6} lg={6}>
          <Form.Item
            name="credit_amount"
            label="Credit Amount"
          >
            <DebouncedCommaSeparatedInputRate
              className="w-full text-right"
              onChange={handleCreditAmountChange}
              disabled={!isEventSelected}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!border-gray-300">
        Sale Invoices
      </Divider>

      <Spin spinning={isItemLoading}>
        <Table
          columns={columns}
          dataSource={isEventSelected ? saleInvoiceDetail : []}
          rowKey={'sale_invoice_detail_id'}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={false}
          sticky={{
            offsetHeader: 56
          }}
        />
      </Spin>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/credit-note">
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

export default CreditNoteForm;