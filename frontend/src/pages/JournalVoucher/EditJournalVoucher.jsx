import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import JournalVoucherForm from '../../components/Form/JournalVoucherForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getJournalVoucher, updateJournalVoucherForm } from '../../store/features/journalVoucherSlice';

const EditJournalVoucher = () => {
  useDocumentTitle('Edit Journal Voucher');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.journalVoucher);

  const onJournalVoucherUpdate = async (data) => {
    try {
      await dispatch(updateJournalVoucherForm({ id, data })).unwrap();
      toast.success('Journal Voucher updated successfully');
      dispatch(getJournalVoucher(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onJournalVoucherUpdates = async (data) => {
    try {
      await dispatch(updateJournalVoucherForm({ id, data })).unwrap();
      toast.success('Journal Voucher updated successfully');
      navigate('/general-ledger/transactions/journal-voucher');
    } catch (error) {
      handleError(error);
    }
  };

  const onJournalVoucherUpdateVendor = async (data) => {
    try {
      const res = await dispatch(updateJournalVoucherForm({ id, data })).unwrap();
      return res;
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getJournalVoucher(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT JOURNAL VOUCHER</PageHeading>
        <Breadcrumb items={[{ title: 'Journal Voucher' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <JournalVoucherForm mode="edit" onSubmit={onJournalVoucherUpdate} onSave={onJournalVoucherUpdates} onVendor={onJournalVoucherUpdateVendor} />
        </div>
      ) : null}
    </>
  );
};

export default EditJournalVoucher;
