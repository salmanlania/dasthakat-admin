import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import VendorChargeOrderForm from '../../components/Form/VendorChargeOrderForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getVendorChargeOrder } from '../../store/features/vendorChargeOrderSlice';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const EditVendorChargeOrderPlatform = () => {
  useDocumentTitle('Edit Vendor Platform Charge Order');
  const dispatch = useDispatch();
  const handleError = useError();
  const { id } = useParams();
  const { initialFormValues, isItemLoading, chargeOrderDetails } = useSelector((state) => state.vendorChargeOrder);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getVendorChargeOrder(id)).unwrap();
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>VIEW VENDOR PLATFORM CHARGE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Platform Charge Order' }, { title: 'View' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <VendorChargeOrderForm mode="edit" />
        </div>
      ) : null}
    </>
  );
};

export default EditVendorChargeOrderPlatform;
