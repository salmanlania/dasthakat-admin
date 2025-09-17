import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelForm from '../../../components/Form/CoaLevelForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getAccountsEdit, resetAccounts, updateAccountsForm } from '../../../store/features/coaAccountsSlice';

const EditCoaLevel = () => {
  useDocumentTitle('Edit Chart Of Account Level One');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading } = useSelector((state) => state.coaAccounts);

  const onCoaLevelOneUpdate = async (data) => {
    try {
      await dispatch(updateAccountsForm({ id, data })).unwrap();
      toast.success('Accounts updated successfully');
      dispatch(getAccountsEdit(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelOneUpdates = async (data) => {
    try {
      await dispatch(updateAccountsForm({ id, data })).unwrap();
      toast.success('Accounts updated successfully');
      navigate('/general-ledger/coa/level');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(resetAccounts());
      dispatch(getAccountsEdit(id)).unwrap();
    } catch (error) {
      handleError();
    }

    return () => {
      try {
        dispatch(resetAccounts());
      } catch (error) {
        handleError(error);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT COA LEVEL</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CoaLevelForm mode="edit" onSubmit={onCoaLevelOneUpdate} onSave={onCoaLevelOneUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditCoaLevel;
