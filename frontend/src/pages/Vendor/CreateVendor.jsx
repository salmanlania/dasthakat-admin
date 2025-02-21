import { Breadcrumb } from 'antd';
import VendorForm from '../../components/Form/VendorForm';
import PageHeading from '../../components/Heading/PageHeading';
import { useNavigate } from 'react-router-dom';
import useError from '../../hooks/useError';
import { useDispatch } from 'react-redux';
import { createVendor } from '../../store/features/vendorSlice';
import toast from 'react-hot-toast';

const CreateVendor = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onVendorCreate = async (data) => {
    try {
      await dispatch(createVendor(data)).unwrap();
      toast.success('Vendor created successfully');
      navigate('/vendor');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE VENDOR</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <VendorForm onSubmit={onVendorCreate} />
      </div>
    </>
  );
};

export default CreateVendor;
