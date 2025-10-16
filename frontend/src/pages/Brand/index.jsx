import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegSave } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';

const Brand = () => {
  const [list, setList] = useState([
    { brand_id: 1, name: 'Brand 1', created_at: '2021-10-01', editable: false },
    { brand_id: 2, name: 'Brand 2', created_at: '2021-11-01', editable: false },
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
      prevList.map((item) => (item.brand_id === id ? { ...item, [field]: value } : item)),
    );
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error('Name field is required');

    setList((prevList) => [
      ...prevList,
      { brand_id: Date.now(), name, created_at: new Date().toISOString(), editable: false },
    ]);
    toast.success('Brand created successfully');
  };

  const onUpdate = async (record) => {
    const { brand_id, name } = record;

    if (!name.trim()) return toast.error('Name field is required');

    setList((prevList) =>
      prevList.map((item) =>
        item.brand_id === brand_id ? { ...item, name, editable: false } : item,
      ),
    );
    toast.success('Brand updated successfully');
  };

  const onCancel = async (id) => {
    if (id === 'new') {
      setList((prevList) => prevList.filter((item) => item.brand_id !== 'new'));
    } else {
      setList((prevList) =>
        prevList.map((item) =>
          item.brand_id === id ? { ...item, editable: false } : item,
        ),
      );
    }
  };

  const onBrandDelete = async (id) => {
    setList((prevList) => prevList.filter((item) => item.brand_id !== id));
    toast.success('Brand deleted successfully');
  };

  const onBulkDelete = async () => {
    setList((prevList) => prevList.filter((item) => !deleteIDs.includes(item.brand_id)));
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
      render: (_, { name, editable, brand_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(brand_id, 'name', e.target.value)}
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
        const { brand_id, editable } = record;

        if (editable) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Cancel" onClick={() => onCancel(brand_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === brand_id}
                  onClick={() => (brand_id === 'new' ? onCreate(record) : onUpdate(record))}
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
                  onClick={() => onChange(brand_id, 'editable', true)}
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
                  onConfirm={() => onBrandDelete(brand_id)}
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
        <PageHeading>BRAND</PageHeading>
        <Breadcrumb items={[{ title: 'Brand' }, { title: 'List' }]} separator=">" />
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
              <Button type="primary" onClick={() => setList([...list, { brand_id: 'new', name: '', editable: true }])}>
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
          rowKey="brand_id"
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

export default Brand;