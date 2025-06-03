import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PickListForm from '../../components/Form/PickListForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getPurchaseOrder, updatePurchaseOrder } from '../../store/features/purchaseOrderSlice';
import { getPickListListDetail } from '../../store/features/pickListSlice';

const EditPickList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isListLoading, initialFormValues } = useSelector((state) => state.pickList);

  const refreshPickList = () => {
    dispatch(getPickListListDetail(id)).unwrap().catch(handleError);
  };

  useEffect(() => {
    refreshPickList()
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT PICK LIST</PageHeading>
        <Breadcrumb items={[{ title: 'Pick List' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isListLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isListLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <PickListForm mode="edit" initialValues={initialFormValues} onRefresh={refreshPickList} />
        </div>
      ) : null}
    </>
  );
};

export default EditPickList;
