import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AgentForm from '../../components/Form/AgentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getAgent, updateAgent } from '../../store/features/agentSlice';

const EditAgent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.agent);

  const onAgentUpdate = async (data) => {
    try {
      await dispatch(updateAgent({ id, data })).unwrap();
      toast.success('Agent updated successfully');
      navigate('/agent');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getAgent(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Agent' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <AgentForm mode="edit" onSubmit={onAgentUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditAgent;
