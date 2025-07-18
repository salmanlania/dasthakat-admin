import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChargeOrderForm from '../../components/Form/ChargeOrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createChargeOrder } from '../../store/features/chargeOrderSlice';

const CreateChargeOrder = () => {
  useDocumentTitle('Create Charge Order');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();
  const { chargeOrderDetailId } = useSelector((state) => state.chargeOrder);

  const onChargeOrderCreate = async (data, additionalRequest = null, chargeOrderDetailId) => {
    try {
      const res = await dispatch(createChargeOrder({ data, additionalRequest })).unwrap();
      toast.success('Charge Order created successfully');
      const createdId = res.data.data.charge_order_id;
      navigate(`/charge-order/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onChargeOrderCreates = async (data, additionalRequest = null, chargeOrderDetailId) => {
    try {
      await dispatch(createChargeOrder({ data, additionalRequest })).unwrap();
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
        <ChargeOrderForm onSubmit={onChargeOrderCreate} onSave={onChargeOrderCreates} />
      </div>
    </>
  );
};

export default CreateChargeOrder;
