import { Breadcrumb, Button, Input, Popconfirm, Select, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';

const User = () => {
  useDocumentTitle('User List');
  const dispatch = useDispatch();
  const handleError = useError();
  const [list , setList] = useState([])

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onUserDelete = async (id) => {
    try {
      toast.success('User deleted successfully');
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      toast.success('Users deleted successfully');
      closeDeleteModal();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>User Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Email</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>User Permission</p>
          <AsyncSelect
            endpoint="/permission"
            valueKey="user_permission_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
          />
        </div>
      ),
      dataIndex: 'permission_name',
      key: 'permission_name',
      sorter: true,
      width: 180,
    },
    {
      title: (
        <div>
          <p>Status</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              {
                value: 1,
                label: 'Active',
              },
              {
                value: 0,
                label: 'Inactive',
              },
            ]}
            allowClear
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status) =>
        status === 1 ? (
          <Tag color="success" className="w-16 text-center">
            Active
          </Tag>
        ) : (
          <Tag color="error" className="w-16 text-center">
            Inactive
          </Tag>
        ),
      width: 120,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { user_id }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <Link to={`/user/edit/${user_id}`}>
              <Button
                size="small"
                type="primary"
                className="bg-gray-500 hover:!bg-gray-400"
                icon={<MdOutlineEdit size={14} />}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete?"
              description="After deleting, You will not be able to recover it."
              okButtonProps={{ danger: true }}
              okText="Yes"
              cancelText="No"
              onConfirm={() => onUserDelete(user_id)}>
              <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
      width: 70,
      fixed: 'right',
    },
  ];

  // if (!permissions.edit && !permissions.delete) {
  //   columns.pop();
  // }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>USER</PageHeading>
        <Breadcrumb items={[{ title: 'User' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
          />

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled
            >
              Delete
            </Button>
            <Link to="/user/create">
              <Button type="primary">Add New</Button>
            </Link>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            {
              type: 'checkbox',
            }
          }
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          dataSource={list}
          rowKey="user_id"
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={"isBulkDeleting"}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these users?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default User;
