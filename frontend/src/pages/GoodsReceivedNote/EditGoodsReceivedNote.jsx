import { Breadcrumb, Spin } from 'antd';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import GoodsReceivedNoteForm from '../../components/Form/GoodsReceivedNoteForm';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import {
  getGoodsReceivedNote,
  updateGoodsReceivedNote
} from '../../store/features/goodsReceivedNoteSlice';

const EditGoodsReceivedNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector((state) => state.goodsReceivedNote);

  const onGoodsReceivedNoteUpdate = async (data) => {
    try {
      await dispatch(updateGoodsReceivedNote({ id, data })).unwrap();
      toast.success('Goods Received Note updated successfully');
      navigate('/goods-received-note');
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getGoodsReceivedNote(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>EDIT GOODS RECEIVED NOTE</PageHeading>
        <Breadcrumb items={[{ title: 'Goods Received Note' }, { title: 'Edit' }]} separator=">" />
      </div>

      {isItemLoading && (
        <div className="mt-4 flex min-h-96 items-center justify-center rounded-md bg-white">
          <Spin size="large" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-4 rounded-md bg-white p-2 sm:p-4">
          <GoodsReceivedNoteForm mode="edit" onSubmit={onGoodsReceivedNoteUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditGoodsReceivedNote;
