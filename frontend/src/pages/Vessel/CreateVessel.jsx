import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VesselForm from '../../components/Form/VesselForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createVessel } from '../../store/features/vesselSlice';

const CreateVessel = () => {
  useDocumentTitle('Create Vessel');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onVesselCreate = async (data) => {
    try {
      await dispatch(createVessel(data)).unwrap();
      toast.success('Vessel created successfully');
      navigate('/vessel');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE VESSEL</PageHeading>
        <Breadcrumb items={[{ title: 'Vessel' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <VesselForm onSubmit={onVesselCreate} />
      </div>
    </>
  );
};

export default CreateVessel;
