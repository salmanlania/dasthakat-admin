import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelThreeForm from '../../../components/Form/CoaLevelThreeForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getCoaLevelThreeEdit, updateCoaLevelThreeForm } from '../../../store/features/coaThreeSlice';

const EditCoaLevelThree = () => {
  useDocumentTitle('Edit Chart Of Account Level Three');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading } = useSelector((state) => state.coaThree);

  const onCoaLevelThreeUpdate = async (data) => {
    try {
      await dispatch(updateCoaLevelThreeForm({ id, data })).unwrap();
      toast.success('COA level Three updated successfully');
      dispatch(getCoaLevelThreeEdit(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelThreeUpdates = async (data) => {
    try {
      await dispatch(updateCoaLevelThreeForm({ id, data })).unwrap();
      toast.success('COA level Three updated successfully');
      navigate('/general-ledger/coa/level3');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getCoaLevelThreeEdit(id)).unwrap();
    } catch (error) {
      handleError();
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT COA LEVEL THREE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level Three' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CoaLevelThreeForm mode="edit" onSubmit={onCoaLevelThreeUpdate} onSave={onCoaLevelThreeUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditCoaLevelThree;
