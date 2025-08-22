import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelTwoForm from '../../../components/Form/CoaLevelTwoForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { createCoaLevelTwo, resetCoaLevelTwo } from '../../../store/features/coaTwoSlice';

const CreateCoaLevelTwo = () => {
  useDocumentTitle('Create Chart Of Account Level Two');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onCoaLevelTwoCreate = async (data) => {
    try {
      const res = await dispatch(createCoaLevelTwo(data)).unwrap();
      const id = res?.data?.coa_level2_id
      toast.success('COA level Two created successfully');
      navigate(`/general-ledger/coa/level2/edit/${id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelTwoCreates = async (data) => {
    try {
      await dispatch(createCoaLevelTwo(data)).unwrap();
      toast.success('COA level Two created successfully');
      navigate('/general-ledger/coa/level2');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(resetCoaLevelTwo());
    } catch (error) {
      handleError();
    }

    return () => {
      try {
        dispatch(resetCoaLevelTwo());
      } catch (error) {
        handleError(error);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE COA LEVEL TWO</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level Two' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CoaLevelTwoForm onSave={onCoaLevelTwoCreates} onSubmit={onCoaLevelTwoCreate} />
      </div>
    </>
  );
};

export default CreateCoaLevelTwo;