import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import { data } from 'autoprefixer';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { HiRefresh } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useError from '../../hooks/useError';
import {
  createChargeOrderPO,
  getChargeOrderVendorWise
} from '../../store/features/chargeOrderSlice';
import { setChargePoID } from '../../store/features/purchaseOrderSlice';

const PurchaseOrderModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { poChargeID, isFormSubmitting } = useSelector((state) => state.purchaseOrder);
  const [details, setDetails] = useState([]);

  const closeModal = () => {
    dispatch(setChargePoID(null));
  };

  const onPOCreate = async () => {
    const payload = [];

    details.forEach((detail) => {
      if (detail.checked) {
        const items = detail.items.map((item) => ({
          charge_order_detail_id: item.charge_order_detail_id,
          ship_via: item.ship_via,
          ship_to: item.ship_to,
          receive_date: item.receive_date ? dayjs(item.receive_date).format('YYYY-MM-DD') : null
        }));

        payload.push({
          supplier_id: detail.supplier_id,
          items
        });
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

  const onValuesChange = (supplierId, chargeDetailId, key, value) => {
    const newDetails = details.map((detail) => {
      if (detail.supplier_id === supplierId) {
        const newItems = detail.items.map((item) => {
          if (item.charge_order_detail_id === chargeDetailId) {
            item[key] = value;
          }
          return item;
        });
        detail.items = newItems;
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
    setDetails(newDetails);
  };

  useEffect(() => {
    if (poChargeID) {
      dispatch(getChargeOrderVendorWise(poChargeID))
        .unwrap()
        .then((data) => {
          console.log(data);
          setDetails(data);
        })
        .catch(handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poChargeID]);

  return (
    <Modal
      open={poChargeID ? true : false}
      destroyOnClose
      closable={false}
      footer={null}
      width={840}>
      <div className="mb-3 flex items-center justify-between text-gray-600">
        <p className="text-base font-medium">Select purchase orders.</p>
      </div>

      <Form
        name="charge-order-modal"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onPOCreate}>
        {details.map((detail) => (
          <div key={detail.supplier_id}>
            <Checkbox
              className="mb-2"
              onChange={(e) => onDetailsCheck(detail.supplier_id, e.target.checked)}>
              {detail.supplier_name}
            </Checkbox>
            {detail.items.map((item) => (
              <div
                className="relative mb-3 rounded border p-3 pb-0"
                key={item.charge_order_detail_id}>
                <div className="py-2">
                  <p>
                    <span className="mr-2 font-medium">Product Name:</span>
                    <span>{item?.product_name}</span>
                  </p>
                  <p>
                    <span className="mr-2 font-medium">Quantity:</span>
                    <span>{parseFloat(item?.quantity || 0)}</span>
                  </p>
                </div>

                <Row gutter={16}>
                  <Col span={24} sm={8} lg={8}>
                    <Form.Item
                      name={`receive_date_${item.charge_order_detail_id}`}
                      label="Receive Date">
                      <DatePicker
                        className="w-full"
                        format="MM-DD-YYYY"
                        onChange={(value) =>
                          onValuesChange(
                            detail.supplier_id,
                            item.charge_order_detail_id,
                            'receive_date',
                            value
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={8} lg={8}>
                    <Form.Item name={`ship_via_${item.charge_order_detail_id}`} label="Ship Via">
                      <Input
                        onChange={(e) =>
                          onValuesChange(
                            detail.supplier_id,
                            item.charge_order_detail_id,
                            'ship_via',
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={8} lg={8}>
                    <Form.Item name={`ship_to_${item.charge_order_detail_id}`} label="Ship To">
                      <Input
                        onChange={(e) =>
                          onValuesChange(
                            detail.supplier_id,
                            item.charge_order_detail_id,
                            'ship_to',
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
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
