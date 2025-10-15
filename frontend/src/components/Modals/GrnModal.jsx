import { Button, Checkbox, Form, Modal } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import useError from '../../hooks/useError';
import { createPurchaseInvoice, getGrn } from '../../store/features/purchaseInvoiceSlice';

const GrnModal = ({ open, onCancel, purchaseOrderId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();

  const [details, setDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onPurchaseInvoice = async () => {
    const payload = [];

    const isAtLeastOneChecked = details.some((detail) => detail?.checked);

    if (!isAtLeastOneChecked) {
      toast.error('Please select at least one vendor');
      return;
    }

    details.forEach((detail) => {
      if (detail.checked) {
        const { checked, ...otherDetails } = detail;
        payload.push({
          ...otherDetails,
        });
      }
    });
    const good_received_note = payload?.map(i => i?.good_received_note_id)
    const document_date = dayjs().format('YYYY-MM-DD');
    try {
      setIsSubmitting(true);
      await dispatch(
        createPurchaseInvoice({
          document_date,
          purchase_order_id: purchaseOrderId,
          good_received_note_id: good_received_note
        })
      ).unwrap();
      toast.success('Purchase invoice created successfully');
      setDetails([])
      onCancel()
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDetailsCheck = (document_identity, value) => {
    const newDetails = details.map((detail) => {
      if (detail.document_identity === document_identity) {
        detail.checked = value;
      }
      return detail;
    });

    setDetails(newDetails);
  };

  useEffect(() => {
    const fetchGrnDetails = async () => {
      if (purchaseOrderId) {
        setLoading(true);
        try {
          const data = await dispatch(getGrn(purchaseOrderId)).unwrap();

          const detail = data.map((detail) => ({
            ...detail,
            document_identity: detail?.document_identity,
            checked: false,
          }));
          setDetails(detail);
        } catch (e) {
          handleError(e);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGrnDetails();
  }, [purchaseOrderId]);

  return (
    <Modal
      open={open}
      destroyOnClose
      onCancel={onCancel}
      footer={null}
      // title={`GRN for Purchase Order #${purchaseOrderId}`}
      loading={isLoading}
      width={840}>
      <div className="mb-3 flex items-center justify-between text-gray-600">
        <p className="text-base font-medium">Create Purchase Invoice</p>
      </div>

      {!details.length ? (
        <p className="my-28 text-center text-base text-gray-600">
          No items found for Goods Receive Note.
        </p>
      ) : null}

      <Form
        name="purchase-order-modal"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onPurchaseInvoice}>
        {details.map((detail) => {
          return (
            <div
              key={detail?.document_identity}
              className="relative my-6 rounded border border-gray-200 px-4 pb-2 pt-6">
              <div className="absolute -top-3 left-4 rounded border border-gray-200 bg-white px-2 py-1">
                <Checkbox onChange={(e) => onDetailsCheck(detail?.document_identity, e.target.checked)}>
                  {detail?.document_identity}
                </Checkbox>
              </div>
            </div>
          )
        })}

        <div className="mt-2 flex items-center justify-center gap-2">
          <Button className="w-40" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="w-40" type="primary" onClick={form.submit} loading={isSubmitting}>
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GrnModal;