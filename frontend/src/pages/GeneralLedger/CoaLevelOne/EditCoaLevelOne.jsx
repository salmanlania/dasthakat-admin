import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelOneForm from '../../../components/Form/CoaLevelOneForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getSaleInvoice, updateSaleInvoiceForm } from '../../../store/features/coaOneSlice';

const EditCoaLevelOne = () => {
  useDocumentTitle('Edit Chart Of Account Level One');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onSaleInvoiceUpdate = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('COA level one updated successfully');
      dispatch(getSaleInvoice(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onSaleInvoiceUpdates = async (data) => {
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
      dispatch(getSaleInvoice(id)).unwrap();
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

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CoaLevelOneForm mode="edit" onSubmit={onSaleInvoiceUpdate} onSave={onSaleInvoiceUpdates} />
      </div>
    </>
  );
};

export default EditCoaLevelOne;
