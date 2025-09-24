import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createPaymentVoucher, resetPaymentVoucherForm } from '../../store/features/paymentVoucherSlice';
import { useEffect } from 'react';
import PaymentVoucherForm from '../../components/Form/PaymentVoucherForm';

const CreatePaymentVoucher = () => {
  useDocumentTitle('Create Payment Voucher');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onPaymentVoucherCreate = async (data) => {
    try {
      const res = await dispatch(createPaymentVoucher(data)).unwrap();
      const createdId = res?.data.payment_voucher_id;
      toast.success('Payment Voucher created successfully');
      navigate(`/general-ledger/transactions/payment-voucher/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onPaymentVoucherCreates = async (data) => {
    try {
      await dispatch(createPaymentVoucher(data)).unwrap();
      toast.success('Payment Voucher created successfully');
      navigate('/general-ledger/transactions/payment-voucher');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetPaymentVoucherForm());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE PAYMENT VOUCHER</PageHeading>
        <Breadcrumb items={[{ title: 'Payment Voucher' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <PaymentVoucherForm onSubmit={onPaymentVoucherCreate} onSave={onPaymentVoucherCreates} />
      </div>
    </>
  );
};

export default CreatePaymentVoucher;
