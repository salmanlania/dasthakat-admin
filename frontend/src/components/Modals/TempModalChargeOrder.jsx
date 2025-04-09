import { Button, Form, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiRefresh } from 'react-icons/hi';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useError from '../../hooks/useError';
import {
  createChargeOrder,
  temporaryServiceOrder,
  viewBeforeCreate,
  setTempChargeOrderID
} from '../../store/features/chargeOrderSlice';
import { changeQuotationDetailValue, getQuotation } from '../../store/features/quotationSlice';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';

const TempModalChargeOrder = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const {
    isFormSubmitting,
    tempChargeOrderID,
    tempChargeDetails,
    isTempDataLoading,
    initialFormValues
  } = useSelector((state) => state.chargeOrder);
  const { user } = useSelector((state) => state.auth);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const closeModal = () => {
    dispatch(setTempChargeOrderID(null));
    setSelectedRowKeys([]);
  };

  const columns = [
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
      render: (_, { product_type, product_name, product }) => {
        return product_type?.name === 'Others' ? product_name : product?.name;
      }
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      width: 240,
      ellipsis: true,
      render: (_, { product_type, product_description, description }) => {
        return product_type?.name === 'Others' ? description : product_description;
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120
    }
  ];

  const onChargeCreate = async () => {
  
    const selectedDetails = tempChargeDetails
      .filter((detail) => selectedRowKeys.includes(detail.charge_order_detail_id))
      .map((detail) => ({
        charge_order_detail_id: detail.charge_order_detail_id
      }));

    const data = {
      service_order: [
        {
          charge_order_id: tempChargeOrderID,
          details: selectedDetails
        }
      ]
    }

    try {
      const res = await dispatch(temporaryServiceOrder({ data })).unwrap();
      const chargeOrderID = res.data.data.charge_order_detail_id;
      closeModal();
      toast.success('Temporary sale order has been created.')
      
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (tempChargeOrderID) {

      dispatch(viewBeforeCreate({ charge_order_id: tempChargeOrderID }))
        .unwrap().catch(handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempChargeOrderID]);

  return (
    <Modal open={tempChargeOrderID !== null} closable={false} footer={null} width={840}>
      <div className="mb-3 flex items-center justify-between text-gray-600">
        <p className="text-base font-medium">Temporary Sale Order.</p>
      </div>

      <Form name="temp-charge-order-modal" form={form} onFinish={onChargeCreate}>
        <Table
          columns={columns}
          dataSource={tempChargeDetails}
          rowKey="charge_order_detail_id"
          pagination={false}
          size="small"
          loading={isTempDataLoading}
          scroll={{ x: 'calc(100% - 200px)', y: 300 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (newSelectedRowKeys) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
            getCheckboxProps: (record) => ({
              disabled: false
            })
          }}
        />

        <div className="mt-2 flex items-center justify-center gap-2">
          <Button className="w-40" onClick={closeModal}>
            Cancel
          </Button>
          <Button className="w-40" type="primary" onClick={form.submit} loading={isFormSubmitting}>
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TempModalChargeOrder;
