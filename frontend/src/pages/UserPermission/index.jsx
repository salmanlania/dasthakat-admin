import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import {
  bulkDeleteUserPermission,
  deleteUserPermission,
  getUserPermissionList,
  setUserPermissionDeleteIDs,
  setUserPermissionListParams,
} from '../../store/features/userPermissionSlice';

const UserPermission = () => {
  useDocumentTitle('User Permission List');
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);

  const handleError = useError();
  const dispatch = useDispatch();

  const { params, paginationInfo, list, isLoading, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.userPermission,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.user_permission;

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedDesc = useDebounce(params.description, 500);

  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  useEffect(() => {
    dispatch(getUserPermissionList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    debouncedSearch,
    params.sort_column,
    params.sort_direction,
    debouncedName,
    debouncedDesc,
  ]);

  const onUserPermissionDelete = async (id) => {
    try {
      await dispatch(deleteUserPermission(id)).unwrap();
      toast.success('Permission deleted successfully');
      dispatch(getUserPermissionList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) => dispatch(setUserPermissionListParams({ name: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Description</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.description}
            onChange={(e) => dispatch(setUserPermissionListParams({ description: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'description',
      sorter: true,
      width: 300,
      ellipsis: true,
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
      render: (_, { user_permission_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/user-permission/edit/${user_permission_id}`}>
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
                onConfirm={() => onUserPermissionDelete(user_permission_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 70,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteUserPermission(deleteIDs)).unwrap();
      toast.success('Permissions deleted successfully');
      closeDeleteModal();
      await dispatch(getUserPermissionList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>USER PERMISSION</PageHeading>
        <Breadcrumb items={[{ title: 'User Permission' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setUserPermissionListParams({ search: e.target.value }))}
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
              <Link to="/user-permission/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <Table
          columns={columns}
          loading={isLoading}
          dataSource={list}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} permissions`,
          }}
          rowKey="user_permission_id"
          size="small"
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          showSorterTooltip={false}
          sticky={{
            offsetHeader: 56,
          }}
          rowSelection={
            permissions.delete
              ? {
                  type: 'checkbox',
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) =>
                    dispatch(setUserPermissionDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          onChange={(page, _, sorting) => {
            dispatch(
              setUserPermissionListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
            );
          }}
          sortDirections={['ascend', 'descend']}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these permissions?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default UserPermission;
