import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelOneForm from '../../../components/Form/CoaLevelOneForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { createCoaLevelOne, resetCoaLevelOne } from '../../../store/features/coaOneSlice';

const CreateCoaLevelOne = () => {
  useDocumentTitle('Create Chart Of Account Level One');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onCoaLevelOneCreate = async (data) => {
    try {
      const res = await dispatch(createCoaLevelOne(data)).unwrap();
      const id = res?.data?.coa_level1_id
      toast.success('COA level one created successfully');
      navigate(`/general-ledger/coa/level1/edit/${id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelOneCreates = async (data) => {
    try {
      await dispatch(createCoaLevelOne(data)).unwrap();
      toast.success('COA level one created successfully');
      navigate('/general-ledger/coa/level1');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(resetCoaLevelOne());
    } catch (error) {
      handleError();
    }

    return () => {
      try {
        dispatch(resetCoaLevelOne());
      } catch (error) {
        handleError(error);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE COA LEVEL ONE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level One' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CoaLevelOneForm onSave={onCoaLevelOneCreates} onSubmit={onCoaLevelOneCreate} />
      </div>
    </>
  );
};

export default CreateCoaLevelOne;