import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AgentForm from '../../components/Form/AgentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { createAgent } from '../../store/features/agentSlice';

const CreateAgent = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onAgentCreate = async (data) => {
    try {
      await dispatch(createAgent(data)).unwrap();
      toast.success('Agent created successfully');
      navigate('/agent');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Agent' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <AgentForm onSubmit={onAgentCreate} />
      </div>
    </>
  );
};

export default CreateAgent;
