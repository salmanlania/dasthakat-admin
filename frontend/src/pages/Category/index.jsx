import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegSave } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';

const Category = () => {
  const [list, setList] = useState([
    { category_id: 1, name: 'Category 1', created_at: '2021-10-01', editable: false },
    { category_id: 2, name: 'Category 2', created_at: '2021-11-01', editable: false },
  ]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteIDs, setDeleteIDs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [permissions] = useState({
    edit: true,
    delete: true,
    add: true,
  });

  const closeDeleteModal = () => setDeleteModalIsOpen(false);

  const onChange = (id, field, value) => {
    setList((prevList) =>
      prevList.map((item) => (item.category_id === id ? { ...item, [field]: value } : item)),
    );
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error('Name field is required');

    setList((prevList) => [
      ...prevList,
      { category_id: Date.now(), name, created_at: new Date().toISOString(), editable: false },
    ]);
    toast.success('Category created successfully');
  };

  const onUpdate = async (record) => {
    const { category_id, name } = record;

    if (!name.trim()) return toast.error('Name field is required');

    setList((prevList) =>
      prevList.map((item) =>
        item.category_id === category_id ? { ...item, name, editable: false } : item,
      ),
    );
    toast.success('Category updated successfully');
  };

  const onCancel = async (id) => {
    if (id === 'new') {
      setList((prevList) => prevList.filter((item) => item.category_id !== 'new'));
    } else {
      setList((prevList) =>
        prevList.map((item) =>
          item.category_id === id ? { ...item, editable: false } : item,
        ),
      );
    }
  };

  const onCategoryDelete = async (id) => {
    setList((prevList) => prevList.filter((item) => item.category_id !== id));
    toast.success('Category deleted successfully');
  };

  const onBulkDelete = async () => {
    setList((prevList) => prevList.filter((item) => !deleteIDs.includes(item.category_id)));
    toast.success('Categories deleted successfully');
    closeDeleteModal();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, category_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(category_id, 'name', e.target.value)}
          />
        ) : (
          <span>{name}</span>
        ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => created_at || <span className="text-gray-400">AUTO</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const { category_id, editable } = record;

        if (editable) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Cancel" onClick={() => onCancel(category_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === category_id}
                  onClick={() => (category_id === 'new' ? onCreate(record) : onUpdate(record))}
                />
              </Tooltip>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            {permissions.edit && (
              <Tooltip title="Edit">
                <Button
                  size="small"
                  type="primary"
                  className="bg-gray-500 hover:!bg-gray-400"
                  icon={<MdOutlineEdit size={14} />}
                  onClick={() => onChange(category_id, 'editable', true)}
                />
              </Tooltip>
            )}
            {permissions.delete && (
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete?"
                  description="After deleting, You will not be able to recover it."
                  okButtonProps={{ danger: true }}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onCategoryDelete(category_id)}
                >
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        );
      },
      width: 70,
      fixed: 'right',
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CATEGORY</PageHeading>
        <Breadcrumb items={[{ title: 'Category' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            onChange={(e) => {}}
          />

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled={!deleteIDs.length}
            >
              Delete
            </Button>
            {permissions.add && (
              <Button type="primary" onClick={() => setList([...list, { category_id: 'new', name: '', editable: true }])}>
                Add New
              </Button>
            )}
          </div>
        </div>

        <Table
          size="small"
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: deleteIDs,
            onChange: (selectedRowKeys) => setDeleteIDs(selectedRowKeys),
          }}
          loading={false}
          rowKey="category_id"
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: list.length,
            pageSize: 50,
            current: 1,
            showTotal: (total) => `Total ${total} categories`,
          }}
          dataSource={list}
          columns={columns}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen}
        onCancel={closeDeleteModal}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these categories?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Category;