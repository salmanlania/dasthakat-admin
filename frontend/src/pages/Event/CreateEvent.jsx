import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/Form/EventForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createEvent } from '../../store/features/eventSlice';

const CreateEvent = () => {
  useDocumentTitle('Create Event');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onEventCreate = async (data) => {
    try {
      await dispatch(createEvent(data)).unwrap();
      toast.success('Event created successfully');
      navigate('/event');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE EVENT</PageHeading>
        <Breadcrumb items={[{ title: 'Event' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <EventForm onSubmit={onEventCreate} />
      </div>
    </>
  );
};

export default CreateEvent;
