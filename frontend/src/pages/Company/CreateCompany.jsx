import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompanyForm from '../../components/Form/CompanyForm';
import PageHeading from '../../components/Heading/PageHeading';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import { createCompany } from '../../store/features/companySlice';

const CreateCompany = () => {
  useDocumentTitle('Create Company');
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCompanyCreate = async (data) => {
    try {
      await dispatch(createCompany(data)).unwrap();
      toast.success('Company created successfully');
      navigate('/company');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE COMPANY</PageHeading>
        <Breadcrumb items={[{ title: 'Company' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <CompanyForm onSubmit={onCompanyCreate} />
      </div>
    </>
  );
};

export default CreateCompany;
