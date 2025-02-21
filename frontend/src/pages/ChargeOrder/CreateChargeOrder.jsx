import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChargeOrderForm from '../../components/Form/ChargeOrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { createChargeOrder } from '../../store/features/chargeOrderSlice';

const CreateChargeOrder = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onChargeOrderCreate = async (data) => {
    try {
      await dispatch(createChargeOrder(data)).unwrap();
      toast.success('Charge Order created successfully');
      navigate('/charge-order');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE CHARGE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Charge Order' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <ChargeOrderForm onSubmit={onChargeOrderCreate} />
      </div>
    </>
  );
};

export default CreateChargeOrder;
