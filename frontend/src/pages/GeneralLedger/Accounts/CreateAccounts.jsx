import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { createAccounts, resetAccounts } from '../../../store/features/accountsSlice';
import AccountsForm from '../../../components/Form/AccountsForm';

const CreateAccounts = () => {
  useDocumentTitle('Create Accounts');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();

  const onCoaLevelOneCreate = async (data) => {
    try {
      const res = await dispatch(createAccounts(data)).unwrap();
      const id = res?.data?.account_id
      toast.success('Accounts created successfully');
      navigate(`/general-ledger/gl-setup/accounts/edit/${id}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelOneCreates = async (data) => {
    try {
      await dispatch(createAccounts(data)).unwrap();
      toast.success('Accounts created successfully');
      navigate('/general-ledger/gl-setup/accounts');
    } catch (error) {
      handleError(error);
    }
  };

  const onCoaLevelOneCreatesNew = async (data) => {
    try {
      const res = await dispatch(createAccounts(data)).unwrap();
      toast.success('Accounts created successfully');
      // dispatch(resetAccounts());
      navigate('/general-ledger/gl-setup/accounts/create');
      return { success: true, data: res };
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE ACCOUNTS</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'Accounts' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <AccountsForm onSave={onCoaLevelOneCreates} onSubmit={onCoaLevelOneCreate} onNew={onCoaLevelOneCreatesNew} />
      </div>
    </>
  );
};

export default CreateAccounts;