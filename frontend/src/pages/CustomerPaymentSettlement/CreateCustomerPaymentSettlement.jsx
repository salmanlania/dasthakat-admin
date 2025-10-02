import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomerPaymentSettlementForm from '../../components/Form/CustomerPaymentSettlementForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createCustomerPaymentSettlement, resetCustomerPaymentSettlementForm } from '../../store/features/customerPaymentSettlementSlice';
import { useEffect } from 'react';

const CreateCustomerPaymentSettlement = () => {
  useDocumentTitle('Create Customer Payment Settlement');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCustomerPaymentSettlementCreate = async (data) => {
    try {
      const res = await dispatch(createCustomerPaymentSettlement(data)).unwrap();
      const createdId = res?.data?.customer_payment_settlement_id
      toast.success('Customer Payment Settlement created successfully');
      resetCustomerPaymentSettlementForm()
      navigate(`/general-ledger/transactions/customer-payment-settlement/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onCustomerPaymentSettlementCreates = async (data) => {
    try {
      await dispatch(createCustomerPaymentSettlement(data)).unwrap();
      toast.success('Customer Payment Settlement created successfully');
      navigate('/general-ledger/transactions/customer-payment-settlement');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetCustomerPaymentSettlementForm());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE CUSTOMER PAYMENT SETTLEMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Customer Payment Settlement' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CustomerPaymentSettlementForm onSubmit={onCustomerPaymentSettlementCreate} onSave={onCustomerPaymentSettlementCreates} />
      </div>
    </>
  );
};

export default CreateCustomerPaymentSettlement;
