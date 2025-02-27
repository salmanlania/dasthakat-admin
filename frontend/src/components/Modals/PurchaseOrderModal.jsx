import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GMS_ADDRESS } from '../../constants';
import useError from '../../hooks/useError';
import {
  createChargeOrderPO,
  getChargeOrderVendorWise
} from '../../store/features/chargeOrderSlice';
import { setChargePoID } from '../../store/features/purchaseOrderSlice';
import DebounceInput from '../Input/DebounceInput';

const PurchaseOrderModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();

  const { poChargeID } = useSelector((state) => state.purchaseOrder);
  const { isFormSubmitting } = useSelector((state) => state.chargeOrder);

  const [details, setDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const closeModal = () => {
    dispatch(setChargePoID(null));
    setDetails([]);
    form.resetFields();
  };

  const onPOCreate = async () => {
    const payload = [];

    const isAtLeastOneChecked = details.some((detail) => detail.checked);

    if (!isAtLeastOneChecked) {
      toast.error('Please select at least one vendor');
      return;
    }

    details.forEach((detail) => {
      if (detail.checked) {
        const { checked, supplier_name, ...otherDetails } = detail;
        payload.push(otherDetails);
      }
    });

    try {
      await dispatch(
        createChargeOrderPO({
          id: poChargeID,
          data: { charge_order_id: poChargeID, vendors: payload }
        })
      );
      dispatch(setChargePoID(null));
      setDetails([]);
    } catch (error) {
      handleError(error);
    }
  };

  const onValuesChange = (supplierId, key, value) => {
    const newDetails = details.map((detail) => {
      if (detail.supplier_id === supplierId) {
        detail[key] = value;
      }
      return detail;
    });

    setDetails(newDetails);
  };

  const onDetailsCheck = (supplierId, value) => {
    const newDetails = details.map((detail) => {
      if (detail.supplier_id === supplierId) {
        detail.checked = value;
      }
      return detail;
    });

    // Update the form field rules
    form.setFields([
      {
        name: `required_date_${supplierId}`,
        rules: [{ required: value, message: 'Required Date is required' }]
      }
    ]);

    setDetails(newDetails);
  };

  useEffect(() => {
    if (poChargeID) {
      setLoading(true);
      dispatch(getChargeOrderVendorWise(poChargeID))
        .unwrap()
        .then((data) => {
          setDetails(data);

          const details = data.map((detail) => ({
            ...detail,
            ship_to: GMS_ADDRESS,
            checked: false
          }));
          setDetails(details);
        })
        .catch(handleError)
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poChargeID]);

  return (
    <Modal
      open={poChargeID ? true : false}
      destroyOnClose
      onCancel={closeModal}
      footer={null}
      loading={isLoading}
      width={840}>
      <div className="mb-3 flex items-center justify-between text-gray-600">
        <p className="text-base font-medium">Create Purchase Order.</p>
      </div>

      {!details.length ? (
        <p className="my-28 text-center text-base text-gray-600">
          No items found for purchase order.
        </p>
      ) : null}

      <Form
        name="charge-order-modal"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onPOCreate}>
        {details.map((detail) => (
          <div
            key={detail.supplier_id}
            className="relative my-6 rounded border border-gray-200 px-4 pb-2 pt-6">
            <div className="absolute -top-3 left-4 rounded border border-gray-200 bg-white px-2 py-1">
              <Checkbox onChange={(e) => onDetailsCheck(detail.supplier_id, e.target.checked)}>
                {detail.supplier_name}
              </Checkbox>
            </div>

            <Row gutter={16}>
              <Col span={24} sm={8} lg={8}>
                <Form.Item
                  name={`required_date_${detail.supplier_id}`}
                  label="Required Date"
                  rules={[
                    {
                      required: detail?.checked ? true : false, // Make it required only if detail.checked is true
                      message: 'Required Date is required' // Error message if the field is empty
                    }
                  ]}>
                  <DatePicker
                    className="w-full"
                    format="MM-DD-YYYY"
                    onChange={(value) => onValuesChange(detail.supplier_id, 'required_date', value)}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={8} lg={8}>
                <Form.Item name={`ship_via_${detail.supplier_id}`} label="Ship Via">
                  <DebounceInput
                    onChange={(value) => onValuesChange(detail.supplier_id, 'ship_via', value)}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={8} lg={8}>
                <Form.Item
                  name={`ship_to_${detail.supplier_id}`}
                  label="Ship To"
                  initialValue={GMS_ADDRESS}>
                  <DebounceInput
                    onChange={(value) => onValuesChange(detail.supplier_id, 'ship_to', value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}

        <div className="mt-2 flex items-center justify-center gap-2">
          <Button className="w-40" onClick={closeModal}>
            Cancel
          </Button>
          <Button className="w-40" type="primary" onClick={form.submit} loading={isFormSubmitting}>
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PurchaseOrderModal;
