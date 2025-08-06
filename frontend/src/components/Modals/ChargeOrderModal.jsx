import { Button, Form, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiRefresh } from 'react-icons/hi';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useError from '../../hooks/useError';
import { createChargeOrder, setChargeQuotationID } from '../../store/features/chargeOrderSlice';
import {
  changeQuotationDetailValue,
  getQuotationModal,
  resetQuotationState
} from '../../store/features/quotationSlice';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import dayjs from 'dayjs';

const ChargeOrderModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { chargeQuotationID, isFormSubmitting } = useSelector((state) => state.chargeOrder);
  const { isItemLoading, quotationDetails, initialFormValues } = useSelector(
    (state) => state.quotation
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const closeModal = () => {
    dispatch(setChargeQuotationID(null));
    setSelectedRowKeys([]);
    dispatch(resetQuotationState());
  };

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      width: 60,
      render: (_, __, index) => `${index + 1}.`
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120,
      render: (_, { product_code }) => product_code || '-'
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 200,
      render: (_, { product_id, product_name, product_type_id }) =>
        product_type_id?.value == 4 ? product_name : product_id?.label
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      width: 240
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      width: 240,
      ellipsis: true
    },
    {
      title: 'Quote Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      fixed: 'right',
      render: (_, { quantity }, index) => {
        const newQuantity = parseFloat(quantity)
        form.setFieldsValue({ [`quantity-${index}`]: newQuantity });
        return (
          <Form.Item
            className="m-0"
            initialValue={newQuantity}
            name={`quantity-${index}`}
            rules={[
              {
                required: true,
                message: 'Quantity required'
              },
              {
                validator: (_, value) => {
                  if (!value || parseFloat(value) <= 0) {
                    return Promise.reject(new Error('Quantity must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <DebouncedCommaSeparatedInput
              value={newQuantity}
              disabled={true}
              onChange={(value) =>
                dispatch(
                  changeQuotationDetailValue({
                    index,
                    key: 'quantity',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
        );
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'available_quantity',
      key: 'available_quantity',
      width: 120,
      render: (_, { available_quantity }, index) => {
        form.setFieldsValue({ [`available_quantity-${index}`]: available_quantity });
        return (
          <Form.Item
            className="m-0"
            initialValue={available_quantity}
            name={`available_quantity-${index}`}
            rules={[
              {
                required: true,
                message: 'Quantity required'
              },
              {
                validator: (_, value) => {
                  if (!value || parseFloat(value) <= 0) {
                    return Promise.reject(new Error('Quantity must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <DebouncedCommaSeparatedInput
              value={available_quantity}
              onChange={(value) =>
                dispatch(
                  changeQuotationDetailValue({
                    index,
                    key: 'available_quantity',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
        );
      }
    }
  ];

  const onChargeCreate = async (values) => {

    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      toast.error('Please select at least one item.');
      return;
    }

    const { vessel_block_status, customer_block_status } = initialFormValues;

    let message = ''

    if (vessel_block_status === 'yes' && customer_block_status === 'yes') {
      message += `Charge order can't be processed because the vessel and customer are on the block list.`;
      toast.error(message);
      return;
    }

    if (vessel_block_status === 'yes') {
      message += `Charge order can't be processed because the vessel is on the block list.`;
      toast.error(message);
      return;
    }

    if (customer_block_status === 'yes') {
      message += `Charge order can't be processed because the customer is on the block list.`;
      toast.error(message);
      return;
    }

    const selectedDetails = quotationDetails.filter((detail) =>
      selectedRowKeys.includes(detail.id)
    );

    const data = {
      ref_document_identity: initialFormValues.document_identity,
      ref_document_type_id: initialFormValues.document_type_id,
      document_date: dayjs().format('YYYY-MM-DD'),
      salesman_id: initialFormValues.salesman_id ? initialFormValues.salesman_id.value : null,
      event_id: initialFormValues.event_id ? initialFormValues.event_id.value : null,
      vessel_id: initialFormValues.vessel_id ? initialFormValues.vessel_id.value : null,
      customer_id: initialFormValues.customer_id ? initialFormValues.customer_id.value : null,
      class1_id: initialFormValues.class1_id ? initialFormValues.class1_id.value : null,
      class2_id: initialFormValues.class2_id ? initialFormValues.class2_id.value : null,
      port_id: initialFormValues.port_id ? initialFormValues.port_id.value : null,
      flag_id: initialFormValues.flag_id ? initialFormValues.flag_id.value : null,
      agent_id: initialFormValues.agent_id ? initialFormValues.agent_id.value : null,
      customer_po_no: values.customer_po_no ? values.customer_po_no : null,
      remarks: initialFormValues.remarks ? initialFormValues.remarks : null,
      charge_order_detail: selectedDetails.map((detail, index) => {
        const { quantity, available_quantity, ...restOfDetail } = detail;
        return {
          ...restOfDetail,
          quotation_detail_id: detail.id,
          product_id: detail.product_id ? detail.product_id.value : null,
          product_type_id: detail.product_type_id ? detail.product_type_id.value : null,
          unit_id: detail.unit_id ? detail.unit_id.value : null,
          supplier_id: detail.supplier_id ? detail.supplier_id.value : null,
          sort_order: index,
          quantity: available_quantity
        };
      })
    };

    try {
      const res = await dispatch(createChargeOrder({ data })).unwrap();
      const chargeOrderID = res.data.data.charge_order_id;
      closeModal();

      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}>
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <IoCheckmarkDoneCircleSharp size={40} className="text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Charge order has been created.
                  </p>
                  {permissions.edit ? (
                    <p
                      className="mt-1 cursor-pointer text-sm text-blue-500 hover:underline"
                      onClick={() => {
                        toast.dismiss(t.id);
                        navigate(`/charge-order/edit/${chargeOrderID}`);
                      }}>
                      View Details
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 8000
        }
      );
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (chargeQuotationID) {
      dispatch(getQuotationModal(chargeQuotationID)).unwrap().catch(handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chargeQuotationID]);

  return (
    <Modal open={chargeQuotationID} closable={false} footer={null} width={"80vw"}>
      <div className="mb-3 flex items-center justify-between text-gray-600">
        <p className="text-base font-medium">Select products to charge order.</p>
        {isItemLoading ? (
          <HiRefresh size={22} className="animate-spin" />
        ) : (
          <p>{initialFormValues?.document_identity}</p>
        )}
      </div>

      <Form name="charge-order-modal" form={form} onFinish={onChargeCreate}>
        <Form.Item
          name="customer_po_no"
          label="Customer PO"
        >
          <input
            style={{ border: '1px solid black', padding: '2px' }}
            type="text"
            placeholder="Enter Customer PO"
            className="ant-input"
          />
        </Form.Item>
        <Table
          columns={columns}
          dataSource={quotationDetails}
          rowKey="id"
          pagination={false}
          size="small"
          loading={isItemLoading}
          scroll={{ x: 'calc(100% - 200px)', y: 300 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
        />

        <div className="mt-2 flex items-center justify-center gap-2">
          <Button className="w-40" onClick={closeModal}>
            Cancel
          </Button>
          <Button className="w-40" type="primary" onClick={form.submit} loading={isFormSubmitting}>
            Charge
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChargeOrderModal;