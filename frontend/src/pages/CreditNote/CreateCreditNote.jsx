import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreditNoteForm from '../../components/Form/CreditNoteForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createCreditNote } from '../../store/features/creditNoteSlice';
import { clearSaleInvoiceDetail } from '../../store/features/saleInvoiceSlice';
import { useEffect } from 'react';

const CreateCreditNote = () => {
  useDocumentTitle('Create Credit Note');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.creditNote;

  const onCreditNoteCreate = async (data) => {
    try {
      const res = await dispatch(createCreditNote(data)).unwrap();
      const createdId = res.data.data.credit_note_id;
      toast.success('Credit note created successfully');
      navigate(`/credit-note/edit/${createdId}`);
    } catch (error) {
      handleError(error);
    }
  };
  const onCreditNoteCreates = async (data) => {
    try {
      await dispatch(createCreditNote(data)).unwrap();
      toast.success('Credit note created successfully');
      navigate('/credit-note');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(clearSaleInvoiceDetail());
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE CREDIT NOTE</PageHeading>
        <Breadcrumb items={[{ title: 'Credit Note' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CreditNoteForm onSubmit={onCreditNoteCreate} onSave={onCreditNoteCreates} />
      </div>
    </>
  );
};

export default CreateCreditNote;
