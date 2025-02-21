import { Breadcrumb, Button, Input, Popconfirm, Select, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  bulkDeleteUser,
  deleteUser,
  getUserList,
  setUserDeleteIDs,
  setUserListParams
} from '../../store/features/userSlice';

const User = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.user
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.user;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedUserName = useDebounce(params.user_name, 500);
  const debouncedEmail = useDebounce(params.email, 500);

  const onUserDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('User deleted successfully');
      dispatch(getUserList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteUser(deleteIDs)).unwrap();
      toast.success('Users deleted successfully');
      closeDeleteModal();
      await dispatch(getUserList(params)).unwrap();
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
            value={params.user_name}
            onChange={(e) => dispatch(setUserListParams({ user_name: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Email</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.email}
            onChange={(e) => dispatch(setUserListParams({ email: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      width: 200,
      ellipsis: true
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
            value={params.permission_id}
            onChange={(value) => dispatch(setUserListParams({ permission_id: value }))}
          />
        </div>
      ),
      dataIndex: 'permission_name',
      key: 'permission_name',
      sorter: true,
      width: 180
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
                label: 'Active'
              },
              {
                value: 0,
                label: 'Inactive'
              }
            ]}
            value={params.status}
            onChange={(value) => dispatch(setUserListParams({ status: value }))}
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
      width: 120
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { user_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
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
          ) : null}
          {permissions.delete ? (
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
          ) : null}
        </div>
      ),
      width: 70,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getUserList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.permission_id,
    params.status,
    debouncedSearch,
    debouncedUserName,
    debouncedEmail
  ]);

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
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setUserListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            {permissions.delete ? (
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModalIsOpen(true)}
                disabled={!deleteIDs.length}>
                Delete
              </Button>
            ) : null}
            {permissions.add ? (
              <Link to="/user/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                  type: 'checkbox',
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) => dispatch(setUserDeleteIDs(selectedRowKeys))
                }
              : null
          }
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          loading={isListLoading}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} users`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setUserListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          dataSource={list}
          rowKey="user_id"
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these users?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default User;
