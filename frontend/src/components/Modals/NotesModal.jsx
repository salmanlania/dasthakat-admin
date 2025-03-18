import { Button, Form, Input, Modal } from 'antd';

const NotesModal = ({
  open,
  onCancel,
  initialValue,
  onSubmit,
  isSubmitting,
  title,
  disabled = false
}) => {
  return (
    <Modal destroyOnClose open={open} title={title} onCancel={onCancel} footer={null}>
      <Form
        name="notes-form"
        autoComplete="off"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          notes: initialValue
        }}
        className="flex flex-col items-center justify-center">
        <Form.Item name="notes" className="w-full">
          <Input.TextArea rows={12} placeholder="Enter notes..." disabled={disabled} />
        </Form.Item>

        <div className="flex items-center justify-center gap-2">
          <Button onClick={onCancel} className="w-28">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            disabled={disabled}
            className="w-28">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NotesModal;
