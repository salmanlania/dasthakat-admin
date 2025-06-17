import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CommissionAgentForm from '../../components/Form/CommissionAgentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { createCommissionAgent } from '../../store/features/commissionAgentSlice';

const CreateCommissionAgent = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCommissionAgentCreate = async (data) => {
    try {
      await dispatch(createCommissionAgent(data)).unwrap();
      toast.success('Commission Agent created successfully');
      navigate('/commission-agent');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE COMMISSION AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Commission Agent' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CommissionAgentForm onSubmit={onCommissionAgentCreate} />
      </div>
    </>
  );
};

export default CreateCommissionAgent;
