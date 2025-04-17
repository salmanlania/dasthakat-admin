import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChargeOrderForm from '../../components/Form/ChargeOrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import PurchaseOrderModal from '../../components/Modals/PurchaseOrderModal';
import useError from '../../hooks/useError';
import {
  createChargeOrderPickList,
  createChargeOrderPO,
  createChargeOrderServiceList,
  getChargeOrder,
  updateChargeOrder
} from '../../store/features/chargeOrderSlice';
import { setChargePoID } from '../../store/features/purchaseOrderSlice';

const EditChargeOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.chargeOrder);

  const onChargeOrderUpdate = async (data, additionalRequest = null) => {
    try {
      await dispatch(updateChargeOrder({ id, data, additionalRequest })).unwrap();

      if (additionalRequest === 'CREATE_PICK_LIST') {
        await dispatch(
          createChargeOrderPickList({
            charge_order_id: id
          })
        ).unwrap();
      }

      if (additionalRequest === 'CREATE_SERVICE_LIST') {
        await dispatch(
          createChargeOrderServiceList({
            charge_order_id: id
          })
        ).unwrap();
      }

      toast.success('Charge Order updated successfully');

      if (additionalRequest !== 'CREATE_PO') {
        // navigate('/charge-order');
        await dispatch(getChargeOrder(id)).unwrap().catch(handleError);
      }
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

      <PurchaseOrderModal />
    </>
  );
};

export default EditChargeOrder;
