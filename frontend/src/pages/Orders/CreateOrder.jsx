import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../../components/Form/OrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
const CreateOrder = () => {
  useDocumentTitle('Create Orders');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onOrderCreate = async (data) => {
    try {
      toast.success('Order created successfully');
      // navigate(`/general-ledger/transactions/order/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onOrderCreates = async (data) => {
    try {
      toast.success('Order created successfully');
      navigate('/orders');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE ORDERS</PageHeading>
        <Breadcrumb items={[{ title: 'Orders' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <OrderForm onSave={onOrderCreates} />
      </div>
    </>
  );
};

export default CreateOrder;
