import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChargeOrderForm from '../../components/Form/ChargeOrderForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { getChargeOrder, updateChargeOrder } from '../../store/features/chargeOrderSlice';

const EditChargeOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.chargeOrder);

  const onChargeOrderUpdate = async (data) => {
    try {
      await dispatch(updateChargeOrder({ id, data })).unwrap();
      toast.success('ChargeOrder updated successfully');
      navigate('/charge-order');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getChargeOrder(id)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT CHARGE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Charge Order' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <ChargeOrderForm mode="edit" onSubmit={onChargeOrderUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditChargeOrder;
