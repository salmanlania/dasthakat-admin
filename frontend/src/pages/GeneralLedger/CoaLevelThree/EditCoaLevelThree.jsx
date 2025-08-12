import { Breadcrumb } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CoaLevelThreeForm from '../../../components/Form/CoaLevelThreeForm';
import PageHeading from '../../../components/Heading/PageHeading';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';
import { getSaleInvoice, updateSaleInvoiceForm } from '../../../store/features/coaThreeSlice';

const EditCoaLevelThree = () => {
  useDocumentTitle('Edit Chart Of Account Level Three');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();

  const onSaleInvoiceUpdate = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('COA level three updated successfully');
      dispatch(getSaleInvoice(id)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onSaleInvoiceUpdates = async (data) => {
    try {
      await dispatch(updateSaleInvoiceForm({ id, data })).unwrap();
      toast.success('COA level three updated successfully');
      navigate('/general-ledger/coa/level3');
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
        <PageHeading>EDIT COA LEVEL THREE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level Three' }, { title: 'Edit' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CoaLevelThreeForm mode="edit" onSubmit={onSaleInvoiceUpdate} onSave={onSaleInvoiceUpdates} />
      </div>
    </>
  );
};

export default EditCoaLevelThree;
