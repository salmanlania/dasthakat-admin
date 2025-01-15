import { Breadcrumb } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoodsReceivedNoteForm from '../../components/Form/GoodsReceivedNoteForm';
import PageHeading from '../../components/heading/PageHeading';
import useError from '../../hooks/useError';
import { createGoodsReceivedNote } from '../../store/features/goodsReceivedNoteSlice';

const CreateGoodsReceivedNote = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onGoodsReceivedNoteCreate = async (data) => {
    try {
      await dispatch(createGoodsReceivedNote(data)).unwrap();
      toast.success('Goods Received Note created successfully');
      navigate('/goods-received-note');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CREATE GOODS RECEIVED NOTE</PageHeading>
        <Breadcrumb items={[{ title: 'Goods Received Note' }, { title: 'Create' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
        <GoodsReceivedNoteForm onSubmit={onGoodsReceivedNoteCreate} />
      </div>
    </>
  );
};

export default CreateGoodsReceivedNote;
