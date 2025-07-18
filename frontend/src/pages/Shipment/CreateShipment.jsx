import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShipmentForm from '../../components/Form/ShipmentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createShipment } from '../../store/features/shipmentSlice';

const CreateShipment = () => {
  useDocumentTitle('Create Shipment');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onShipmentCreate = async (data) => {
    try {
      await dispatch(createShipment(data)).unwrap();
      toast.success('Shipment created successfully');
      navigate('/shipment');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE SHIPMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Shipment' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <ShipmentForm onSubmit={onShipmentCreate} />
      </div>
    </>
  );
};

export default CreateShipment;
