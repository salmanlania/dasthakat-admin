import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VendorPaymentForm from '../../components/Form/VendorPaymentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getVendorPayment, updateVendorPaymentForm } from '../../store/features/vendorPaymentSlice';

const EditVendorPayment = () => {
  useDocumentTitle('Edit Vendor Payment');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.vendorPayment);

  const onVendorPaymentUpdate = async (data) => {
    try {
      await dispatch(updateVendorPaymentForm({ id, data })).unwrap();
      toast.success('Vendor Payment updated successfully');
      dispatch(getVendorPayment(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onVendorPaymentUpdates = async (data) => {
    try {
      await dispatch(updateVendorPaymentForm({ id, data })).unwrap();
      toast.success('Vendor Payment updated successfully');
      navigate('/general-ledger/transactions/vendor-payment');
    } catch (error) {
      handleError(error);
    }
  };

  const onVendorPaymentUpdateVendor = async (data) => {
    try {
      const res = await dispatch(updateVendorPaymentForm({ id, data })).unwrap();
      return res;
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getVendorPayment(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT VENDOR PAYMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Payment' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <VendorPaymentForm mode="edit" onSubmit={onVendorPaymentUpdate} onSave={onVendorPaymentUpdates} onVendor={onVendorPaymentUpdateVendor} />
        </div>
      ) : null}
    </>
  );
};

export default EditVendorPayment;