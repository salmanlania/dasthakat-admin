import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerPaymentSettlementForm from '../../components/Form/CustomerPaymentSettlementForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getCustomerPaymentSettlement, updateCustomerPaymentSettlementForm } from '../../store/features/customerPaymentSettlementSlice';

const EditCustomerPaymentSettlement = () => {
  useDocumentTitle('Edit Customer Payment Settlement');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.customerPaymentSettlement);

  const onCustomerPaymentSettlementUpdate = async (data) => {
    try {
      await dispatch(updateCustomerPaymentSettlementForm({ id, data })).unwrap();
      toast.success('Customer Payment Settlement updated successfully');
      dispatch(getCustomerPaymentSettlement(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onCustomerPaymentSettlementUpdates = async (data) => {
    try {
      await dispatch(updateCustomerPaymentSettlementForm({ id, data })).unwrap();
      toast.success('Customer Payment Settlement updated successfully');
      navigate('/general-ledger/transactions/customer-payment-settlement');
    } catch (error) {
      handleError(error);
    }
  };

  const onCustomerPaymentSettlementUpdateVendor = async (data) => {
    try {
      const res = await dispatch(updateCustomerPaymentSettlementForm({ id, data })).unwrap();
      return res;
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getCustomerPaymentSettlement(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT CUSTOMER PAYMENT SETTLEMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Customer Payment Settlement' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CustomerPaymentSettlementForm mode="edit" onSubmit={onCustomerPaymentSettlementUpdate} onSave={onCustomerPaymentSettlementUpdates} onVendor={onCustomerPaymentSettlementUpdateVendor} />
        </div>
      ) : null}
    </>
  );
};

export default EditCustomerPaymentSettlement;