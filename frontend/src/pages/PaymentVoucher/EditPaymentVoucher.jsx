import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentVoucherForm from '../../components/Form/PaymentVoucherForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getPaymentVoucher, updatePaymentVoucherForm } from '../../store/features/paymentVoucherSlice';

const EditPaymentVoucher = () => {
  useDocumentTitle('Edit Payment Voucher');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.paymentVoucher);

  const onPaymentVoucherUpdate = async (data) => {
    try {
      await dispatch(updatePaymentVoucherForm({ id, data })).unwrap();
      toast.success('Payment Voucher updated successfully');
      dispatch(getPaymentVoucher(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onPaymentVoucherUpdates = async (data) => {
    try {
      await dispatch(updatePaymentVoucherForm({ id, data })).unwrap();
      toast.success('Payment Voucher updated successfully');
      navigate('/general-ledger/transactions/payment-voucher');
    } catch (error) {
      handleError(error);
    }
  };

  const onPaymentVoucherUpdateVendor = async (data) => {
    try {
      const res = await dispatch(updatePaymentVoucherForm({ id, data })).unwrap();
      return res;
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getPaymentVoucher(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT PAYMENT VOUCHER</PageHeading>
        <Breadcrumb items={[{ title: 'Payment Voucher' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <PaymentVoucherForm mode="edit" onSubmit={onPaymentVoucherUpdate} onSave={onPaymentVoucherUpdates} onVendor={onPaymentVoucherUpdateVendor} />
        </div>
      ) : null}
    </>
  );
};

export default EditPaymentVoucher;
