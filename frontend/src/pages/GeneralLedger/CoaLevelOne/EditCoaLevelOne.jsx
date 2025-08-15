import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelOneForm from '../../../components/Form/CoaLevelOneForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getCoaLevelOneEdit, updateCoaLevelOneForm } from '../../../store/features/coaOneSlice';

const EditCoaLevelOne = () => {
  useDocumentTitle('Edit Chart Of Account Level One');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading } = useSelector((state) => state.coaOne);

  const onCoaLevelOneUpdate = async (data) => {
    try {
      await dispatch(updateCoaLevelOneForm({ id, data })).unwrap();
      toast.success('COA level one updated successfully');
      dispatch(getCoaLevelOneEdit(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelOneUpdates = async (data) => {
    try {
      await dispatch(updateCoaLevelOneForm({ id, data })).unwrap();
      toast.success('COA level one updated successfully');
      navigate('/general-ledger/coa/level1');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getCoaLevelOneEdit(id)).unwrap();
    } catch (error) {
      handleError();
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT COA LEVEL ONE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level One' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CoaLevelOneForm mode="edit" onSubmit={onCoaLevelOneUpdate} onSave={onCoaLevelOneUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditCoaLevelOne;
