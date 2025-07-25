import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VendorQuotationForm from '../../components/Form/VendorQuotationForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getVendorQuotation } from '../../store/features/vendorQuotationSlice';

const EditVendorPlatform = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { initialFormValues, isItemLoading } = useSelector((state) => state.vendorQuotation);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getVendorQuotation(id)).unwrap();
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
        <PageHeading>VIEW VENDOR QUOTATION</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Quotation' }, { title: 'View' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <VendorQuotationForm mode="edit" />
        </div>
      ) : null}
    </>
  );
};

export default EditVendorPlatform;
