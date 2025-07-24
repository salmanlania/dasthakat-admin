import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import VendorQuotationForm from '../../components/Form/VendorQuotationForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getVendorQuotation, updateQuotation } from '../../store/features/vendorQuotationSlice';
import ChargeOrderForm from '../../components/Form/ChargeOrderForm';

const EditVendorPlatform = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  // const { initialFormValues } = useSelector((state) => state.vendorQuotation);

  const onQuotationUpdate = async (data) => {
    try {
      await dispatch(updateQuotation({ id, data })).unwrap();
      toast.success('Quotation updated successfully');
      dispatch(getVendorQuotation(id)).unwrap().catch(handleError);
    } catch (error) {
      handleError(error);
    }
  };
  const onQuotationUpdates = async (data) => {
    try {
      await dispatch(updateQuotation({ id, data })).unwrap();
      toast.success('Quotation updated successfully');
      navigate('/quotation');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    // if (initialFormValues) {
    //   console.log('initialFormValues', initialFormValues);
    // } else {
    //   console.log('No initial form values found');
    // }
    try {
      const res = dispatch(getVendorQuotation(id)).unwrap();
      console.log('res', res)
    } catch (error) {
      handleError(error)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>VIEW VENDOR QUOTATION</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Quotation' }, { title: 'View' }]} separator=">" />
      </div>

      {/* {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )} */}

      {/* {!isItemLoading && initialFormValues ? ( */}
      {/* <div className="mt-4 rounded-md bg-white p-2 sm:p-4"> */}
      <VendorQuotationForm mode="edit" onSubmit={onQuotationUpdate} onSave={onQuotationUpdates} />
      {/* <VendorQuotationForm /> */}
      {/* <ChargeOrderForm /> */}
      {/* </div> */}
      {/* // ) : null} */}
    </>
  );
};

export default EditVendorPlatform;
