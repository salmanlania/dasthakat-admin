import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomerPaymentForm from '../../components/Form/CustomerPaymentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createCustomerPayment } from '../../store/features/transactionAccountSlice';

const CreateCustomerPayment = () => {
  useDocumentTitle('Create Customer Payment');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCustomerPaymentCreate = async (data) => {
    try {
      // const res = await dispatch(createCustomerPayment(data)).unwrap();
      await dispatch(createCustomerPayment(data)).unwrap();
      // const createdId = res.data.data.quotation_id;
      toast.success('Customer Payment created successfully');
      // navigate(`/general-ledger/transactions/customer-payment/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onCustomerPaymentCreates = async (data) => {
    try {
      const res = await dispatch(createCustomerPayment(data)).unwrap();
      const createdId = res.data.data.quotation_id;
      toast.success('Customer Payment created successfully');
      navigate('/general-ledger/transactions/customer-payment');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE CUSTOMER PAYMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Customer Payment' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CustomerPaymentForm onSubmit={onCustomerPaymentCreate} onSave={onCustomerPaymentCreates} />
      </div>
    </>
  );
};

export default CreateCustomerPayment;
