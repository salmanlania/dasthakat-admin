import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelThreeForm from '../../../components/Form/CoaLevelThreeForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { createCoaLevelThree, resetCoaLevelThree } from '../../../store/features/coaThreeSlice';

const CreateCoaLevelThree = () => {
  useDocumentTitle('Create Chart Of Account Level Three');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onCoaLevelThreeCreate = async (data) => {
    try {
      const res = await dispatch(createCoaLevelThree(data)).unwrap();
      const id = res?.data?.coa_level3_id
      toast.success('COA level three created successfully');
      navigate(`/general-ledger/coa/level3/edit/${id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelThreeCreates = async (data) => {
    try {
      await dispatch(createCoaLevelThree(data)).unwrap();
      toast.success('COA level three created successfully');
      navigate('/general-ledger/coa/level3');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(resetCoaLevelThree());
    } catch (error) {
      handleError();
    }

    return () => {
      try {
        dispatch(resetCoaLevelThree());
      } catch (error) {
        handleError(error);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE COA LEVEL THREE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level Three' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CoaLevelThreeForm onSave={onCoaLevelThreeCreates} onSubmit={onCoaLevelThreeCreate} />
      </div>
    </>
  );
};

export default CreateCoaLevelThree;