import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelTwoForm from '../../../components/Form/CoaLevelTwoForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getSaleInvoice, updateSaleInvoiceForm, resetSaleInvoiceForm } from '../../../store/features/coaTwoSlice';

const CreateCoaLevelTwo = () => {
  useDocumentTitle('Create Chart Of Account Level Two');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onSaleInvoiceCreate = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('COA level one updated successfully');
      dispatch(getSaleInvoice(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onSaleInvoiceCreates = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('COA level one updated successfully');
      navigate('/general-ledger/coa/level1');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(resetSaleInvoiceForm());
    } catch (error) {
      handleError();
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE COA LEVEL ONE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level Two' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CoaLevelTwoForm onSubmit={onSaleInvoiceCreate} onSave={onSaleInvoiceCreates} />
      </div>
    </>
  );
};

export default CreateCoaLevelTwo;