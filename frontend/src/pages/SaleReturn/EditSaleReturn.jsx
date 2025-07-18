import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SaleReturnForm from '../../components/Form/SaleReturnForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { updatePurchaseReturn } from '../../store/features/purchaseReturnSlice';
import { getSaleReturn, updateSaleReturn } from '../../store/features/saleReturnSlice';
import { updateStockReturn } from '../../store/features/stockReturnSlice';

const EditSaleReturn = () => {
  useDocumentTitle('Edit Credit Note');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.saleReturn);

  const onSaleReturnUpdate = async (data) => {
    try {
      const stock_return_id = data?.stockReturnDetail?.stock_return?.stock_return_id;
      const purchase_return_id = data?.purchaseReturnDetail?.purchase_return?.purchase_return_id;
      const type_ids = data?.sale_return_detail.map((i) => i.product_type_id?.value) || [];
      await dispatch(updateSaleReturn({ id, data })).unwrap();

      if (type_ids.some((id) => id === 3 || id === 4)) {
        try {
          await dispatch(
            updatePurchaseReturn({
              id: purchase_return_id,
              data: data?.purchaseReturnDetail?.purchase_return,
            }),
          ).unwrap();
        } catch (error) {
          handleError(error);
        }
      }

      if (type_ids.includes(2)) {
        try {
          await dispatch(
            updateStockReturn({ id: stock_return_id, data: data?.stockReturnDetail?.stock_return }),
          ).unwrap();
        } catch (error) {
          handleError(error);
        }
      }

      toast.success('Credit Note updated successfully');
      dispatch(getSaleReturn(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };

  const onSaleReturnUpdates = async (data) => {
    try {
      const stock_return_id = data?.stockReturnDetail?.stock_return?.stock_return_id;
      const purchase_return_id = data?.purchaseReturnDetail?.purchase_return?.purchase_return_id;
      const type_ids = data?.sale_return_detail.map((i) => i.product_type_id?.value) || [];
      await dispatch(updateSaleReturn({ id, data })).unwrap();

      if (type_ids.some((id) => id === 3 || id === 4)) {
        try {
          await dispatch(
            updatePurchaseReturn({
              id: purchase_return_id,
              data: data?.purchaseReturnDetail?.purchase_return,
            }),
          ).unwrap();
        } catch (error) {
          handleError(error);
        }
      }

      if (type_ids.includes(2)) {
        try {
          await dispatch(
            updateStockReturn({ id: stock_return_id, data: data?.stockReturnDetail?.stock_return }),
          ).unwrap();
        } catch (error) {
          handleError(error);
        }
      }

      toast.success('Credit Note updated successfully');
      navigate('/credit-note');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    // dispatch(getSaleReturn(id)).unwrap().catch(handleError);
    try {
      dispatch(getSaleReturn(id)).unwrap();
    } catch (error) {
      handleError();
    }
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
          <SaleReturnForm mode="edit" onSubmit={onSaleReturnUpdate} onSave={onSaleReturnUpdates} />
        </div>
      ) : null}
    </>
  );
};

export default EditSaleReturn;
