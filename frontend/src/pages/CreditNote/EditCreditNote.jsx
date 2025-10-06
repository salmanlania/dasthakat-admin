import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CreditNoteForm from '../../components/Form/CreditNoteForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { getCreditNote, updateCreditNote } from '../../store/features/creditNoteSlice';
import { clearSaleInvoiceDetail } from '../../store/features/saleInvoiceSlice';

const EditCreditNote = () => {
  useDocumentTitle('Edit Credit Note');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.creditNote);

  const onCreditNoteUpdate = async (data) => {
    try {
      await dispatch(updateCreditNote({ id, data })).unwrap();
      toast.success('Credit Note updated successfully');
      dispatch(getCreditNote(id)).unwrap()
    } catch (error) {
      handleError(error);
    }
  };

  const onCreditNoteUpdates = async (data) => {
    try {
      await dispatch(updateCreditNote({ id, data })).unwrap();
      toast.success('Credit Note updated successfully');
      navigate('/credit-note');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(clearSaleInvoiceDetail());
      dispatch(getCreditNote(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT CREDIT NOTE</PageHeading>
        <Breadcrumb items={[{ title: 'Credit Note' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <CreditNoteForm mode="edit" onSubmit={onCreditNoteUpdate} onSave={onCreditNoteUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditCreditNote;