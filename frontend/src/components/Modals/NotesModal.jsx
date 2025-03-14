/* eslint-disable react/prop-types */
import { Button, Modal } from 'antd';
import { TbAlertOctagonFilled } from 'react-icons/tb';

const NotesModal = ({ open, onCancel, initialValue, onSubmit, isSubmitting }) => {
  return (
    <Modal open={open} onCancel={onCancel} footer={null} closable={false}>
      <div className="flex flex-col items-center justify-center">
        <TbAlertOctagonFilled size={80} className="mb-4 text-error" />
        <h4 className="text-center text-lg font-semibold">{title}</h4>
        {description && <p className="text-center">{description}</p>}

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={onSubmit} loading={isSubmitting}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NotesModal;
