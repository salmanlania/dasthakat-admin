import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createJournalVoucher, resetJournalVoucherForm } from '../../store/features/journalVoucherSlice';
import { useEffect } from 'react';
import JournalVoucherForm from '../../components/Form/JournalVoucherForm';

const CreateJournalVoucher = () => {
  useDocumentTitle('Create Journal Voucher');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onJournalVoucherCreate = async (data) => {
    try {
      const res = await dispatch(createJournalVoucher(data)).unwrap();
      const createdId = res?.data.journal_voucher_id;
      toast.success('Payment Voucher created successfully');
      navigate(`/general-ledger/transactions/journal-voucher/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onJournalVoucherCreates = async (data) => {
    try {
      await dispatch(createJournalVoucher(data)).unwrap();
      toast.success('Payment Voucher created successfully');
      navigate('/general-ledger/transactions/journal-voucher');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(resetJournalVoucherForm());
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE JOURNAL VOUCHER</PageHeading>
        <Breadcrumb items={[{ title: 'Journal Voucher' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <JournalVoucherForm onSubmit={onJournalVoucherCreate} onSave={onJournalVoucherCreates} />
      </div>
    </>
  );
};

export default CreateJournalVoucher;
