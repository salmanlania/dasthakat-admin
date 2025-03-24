import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ShipmentForm from '../../components/Form/ShipmentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getShipment, updateShipment } from '../../store/features/shipmentSlice';

const EditShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.shipment);

  const onShipmentUpdate = async (data) => {
    try {
      await dispatch(updateShipment({ id, data })).unwrap();
      toast.success('Shipment updated successfully');
      navigate('/shipment');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getShipment(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT SHIPMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Shipment' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <ShipmentForm mode="edit" onSubmit={onShipmentUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditShipment;
