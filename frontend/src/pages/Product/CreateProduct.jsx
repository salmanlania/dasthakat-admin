import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/Form/ProductForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { createProduct } from '../../store/features/productSlice';

const CreateProduct = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onProductCreate = async (data) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      toast.success('Product created successfully');
      navigate('/product');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE PRODUCT</PageHeading>
        <Breadcrumb items={[{ title: 'Product' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <ProductForm onSubmit={onProductCreate} />
      </div>
    </>
  );
};

export default CreateProduct;
