import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import AccountsForm from '../../../components/Form/AccountsForm';
import { getAccountsEdit, resetAccounts, updateAccountsForm } from '../../../store/features/accountsSlice';

const EditAccounts = () => {
  useDocumentTitle('Edit Accounts');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading } = useSelector((state) => state.accounts);

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
      navigate('/general-ledger/accounts');
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelOneNew = async (data) => {
    try {
      await dispatch(updateAccountsForm({ id, data })).unwrap();
      toast.success('Accounts updated successfully');
      dispatch(resetAccounts());
      navigate('/general-ledger/accounts/create');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getAccountsEdit(id)).unwrap();
    } catch (error) {
      handleError();
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT ACCOUNTS</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'Accounts' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <AccountsForm mode="edit" onSubmit={onCoaLevelOneUpdate} onSave={onCoaLevelOneUpdates} onNew={onCoaLevelOneNew} />
        </div>
      ) : null}
    </>
  );
};

export default EditAccounts;
