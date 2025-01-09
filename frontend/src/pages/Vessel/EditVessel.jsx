import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VesselForm from '../../components/Form/VesselForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { getVessel, updateVessel } from '../../store/features/vesselSlice';

const EditVessel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.vessel);

  const onVesselUpdate = async (data) => {
    try {
      await dispatch(updateVessel({ id, data })).unwrap();
      toast.success('Vessel updated successfully');
      navigate('/vessel');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getVessel(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT VESSEL</PageHeading>
        <Breadcrumb items={[{ title: 'Vessel' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <VesselForm mode="edit" onSubmit={onVesselUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditVessel;
