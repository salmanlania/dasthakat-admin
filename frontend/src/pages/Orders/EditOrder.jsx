import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import OrderForm from '../../components/Form/OrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';

const EditOrders = () => {
  useDocumentTitle('Edit Orders');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onOrderUpdates = async (data) => {
    try {
      toast.success('Orders updated successfully');
      navigate('/orders');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Orders' }, { title: 'Edit' }]} separator=">" />
      </div>

      {/* {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )} */}

        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <OrderForm mode="edit" onSave={onOrderUpdates} />
        </div>
    </>
  );
};

export default EditOrders;