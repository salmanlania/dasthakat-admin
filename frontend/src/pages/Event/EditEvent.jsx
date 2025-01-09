import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../../components/Form/EventForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { getEvent, updateEvent } from '../../store/features/eventSlice';

const EditEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.event);

  const onEventUpdate = async (data) => {
    try {
      await dispatch(updateEvent({ id, data })).unwrap();
      toast.success('Event updated successfully');
      navigate('/event');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getEvent(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT EVENT</PageHeading>
        <Breadcrumb items={[{ title: 'Event' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <EventForm mode="edit" onSubmit={onEventUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditEvent;
