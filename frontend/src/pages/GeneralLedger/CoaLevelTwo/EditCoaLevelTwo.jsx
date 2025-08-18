import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelTwoForm from '../../../components/Form/CoaLevelTwoForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getCoaLevelTwoEdit, resetCoaLevelTwo, updateCoaLevelTwoForm } from '../../../store/features/coaTwoSlice';

const EditCoaLevelTwo = () => {
  useDocumentTitle('Edit Chart Of Account Level Two');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading } = useSelector((state) => state.coaTwo);

  const onCoaLevelTwoUpdate = async (data) => {
    try {
      await dispatch(updateCoaLevelTwoForm({ id, data })).unwrap();
      toast.success('COA level Two updated successfully');
      dispatch(getCoaLevelTwoEdit(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelTwoUpdates = async (data) => {
    try {
      await dispatch(updateCoaLevelTwoForm({ id, data })).unwrap();
      toast.success('COA level Two updated successfully');
      navigate('/general-ledger/coa/level2');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(resetCoaLevelTwo());
      dispatch(getCoaLevelTwoEdit(id)).unwrap();
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
        <PageHeading>EDIT COA LEVEL TWO</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level Two' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CoaLevelTwoForm mode="edit" onSubmit={onCoaLevelTwoUpdate} onSave={onCoaLevelTwoUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditCoaLevelTwo;
