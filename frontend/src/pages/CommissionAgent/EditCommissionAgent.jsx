import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CommissionAgentForm from '../../components/Form/CommissionAgentForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import {
  getCommissionAgent,
  updateCommissionAgent
} from '../../store/features/commissionAgentSlice';

const EditCommissionAgent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.commissionAgent);

  const onCommissionAgentUpdate = async (data) => {
    try {
      await dispatch(updateCommissionAgent({ id, data })).unwrap();
      toast.success('Commission Agent updated successfully');
      navigate('/commission-agent');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getCommissionAgent(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT COMMISSION AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Commission Agent' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CommissionAgentForm mode="edit" onSubmit={onCommissionAgentUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditCommissionAgent;
