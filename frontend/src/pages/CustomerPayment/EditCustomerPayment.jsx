import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerPaymentForm from '../../components/Form/CustomerPaymentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getCustomerPayment, updateCustomerPaymentForm } from '../../store/features/customerPaymentSlice';

const EditCustomerPayment = () => {
  useDocumentTitle('Edit Customer Payment');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.customerPayment);

  const onCustomerPaymentUpdate = async (data) => {
    try {
      await dispatch(updateCustomerPaymentForm({ id, data })).unwrap();
      toast.success('Customer Payment updated successfully');
      dispatch(getCustomerPayment(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onCustomerPaymentUpdates = async (data) => {
    try {
      await dispatch(updateCustomerPaymentForm({ id, data })).unwrap();
      toast.success('Customer Payment updated successfully');
      navigate('/general-ledger/transactions/customer-payment');
    } catch (error) {
      handleError(error);
    }
  };

  const onCustomerPaymentUpdateVendor = async (data) => {
    try {
      const res = await dispatch(updateCustomerPaymentForm({ id, data })).unwrap();
      return res;
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getCustomerPayment(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT CUSTOMER PAYMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Customer Payment' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CustomerPaymentForm mode="edit" onSubmit={onCustomerPaymentUpdate} onSave={onCustomerPaymentUpdates} onVendor={onCustomerPaymentUpdateVendor} />
        </div>
      ) : null}
    </>
  );
};

export default EditCustomerPayment;
