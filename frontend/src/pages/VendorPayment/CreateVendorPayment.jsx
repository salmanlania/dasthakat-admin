import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VendorPaymentForm from '../../components/Form/VendorPaymentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createVendorPayment, resetVendorPaymentForm } from '../../store/features/vendorPaymentSlice';
import { useEffect } from 'react';

const CreateVendorPayment = () => {
  useDocumentTitle('Create Vendor Payment');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onVendorPaymentCreate = async (data) => {
    try {
      const res = await dispatch(createVendorPayment(data)).unwrap();
      const createdId = res?.data.vendor_payment_id;
      toast.success('Vendor Payment created successfully');
      navigate(`/general-ledger/transactions/vendor-payment/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onVendorPaymentCreates = async (data) => {
    try {
      await dispatch(createVendorPayment(data)).unwrap();
      toast.success('Vendor Payment created successfully');
      navigate('/general-ledger/transactions/vendor-payment');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetVendorPaymentForm());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE VENDOR PAYMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Payment' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <VendorPaymentForm onSubmit={onVendorPaymentCreate} onSave={onVendorPaymentCreates} />
      </div>
    </>
  );
};

export default CreateVendorPayment;