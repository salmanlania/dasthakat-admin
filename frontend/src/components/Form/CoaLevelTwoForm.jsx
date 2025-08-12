/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useError from '../../hooks/useError';
import { getProduct } from '../../store/features/productSlice';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';

const CoaLevelTwoForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, saleInvoiceDetail } = useSelector(
    (state) => state.coaTwo
  );

  const [totalQuantity, setTotalQuantity] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [submitAction, setSubmitAction] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [returnModalVisible, setReturnModalVisible] = useState(false);

  const onFinish = (values) => {
    if (!totalAmount) return toast.error('Total Amount cannot be zero');

    const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : null);

    const data = {
      ...values,
      ship_date: formatDate(values.ship_date),
      document_date: formatDate(values.document_date),
      required_date: formatDate(values.required_date),
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
          : null,
        ship_date: initialFormValues?.ship_date
          ? dayjs(dayjs(initialFormValues.ship_date).format('YYYY-MM-DD'))
          : null,
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
      width: 20
    },
    {
      title: 'Level 1',
      dataIndex: 'product_type_id',
      key: 'product_type_id',
      render: (_, record, index) => {
        const fullValue = record.product_type_id?.label.toString() || '';
        return (
          <DebounceInput
            disabled
            value={fullValue}
          />
        );
      },
      width: 140
    },
    {
      title: 'Code',
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
      title: 'Name',
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
  ];

  const saleReturnRows = selectedRows.filter(row =>
    row.product_type_no !== '1' || row.product_type_no !== 1
  );

  return (
    <>
      <Form
        name="coaTwo"
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

        <Row gutter={12}>
          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="event_id" label="Level 1">
              <Select
                labelInValue
                options={[
                  { value: '1', label: 'Asset' },
                  { value: '2', label: 'Liability' },
                  { value: '3', label: 'Equity' },
                  { value: '4', label: 'Revenue' },
                  { value: '5', label: 'Expense' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={4} lg={4}>
            <Form.Item name="charger_order_id" label="Code">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item name="customer_id" label="Name">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={saleInvoiceDetail}
          rowKey={'charge_order_detail_id'}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={false}
          sticky={{
            offsetHeader: 56
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys, newSelectedRows) => {
              setSelectedRowKeys(newSelectedRowKeys);
              setSelectedRows(newSelectedRows);
            }
          }}
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/coa/level2">
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
    </>
  );
};

export default CoaLevelTwoForm;