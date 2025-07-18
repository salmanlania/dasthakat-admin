import { Button, Input, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import {
  bulkDeleteBrand,
  createBrand,
  deleteBrand,
  getAuditList,
  removeNewBrand,
  setBrandEditable,
  setBrandListParams,
  updateBrand,
  updateBrandListValue,
} from '../../store/features/auditSlice';
import { formatLabel } from '../../utils/string';

const Brand = () => {
  useDocumentTitle('Audit List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, isSubmitting, deleteIDs } =
    useSelector((state) => state.audit);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.brand;

  const debouncedSearch = useDebounce(params.search, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updateBrandListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(createBrand({ name })).unwrap();
      await dispatch(getAuditList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { brand_id, name } = record;

    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(
        updateBrand({
          id: brand_id,
          data: { name },
        }),
      ).unwrap();
      await dispatch(getAuditList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === 'new') return dispatch(removeNewBrand());
    dispatch(setBrandEditable({ id, editable: false }));
  };

  const onBrandDelete = async (id) => {
    try {
      await dispatch(deleteBrand(id)).unwrap();
      toast.success('Brand deleted successfully');
      dispatch(getAuditList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteBrand(deleteIDs)).unwrap();
      toast.success('Brand deleted successfully');
      closeDeleteModal();
      await dispatch(getAuditList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'company_name',
      key: 'company_name',
      sorter: true,
      className: 'text-xs',

      render: (_, { company }) => company?.name || null,
    },
    {
      title: 'Company Branch',
      dataIndex: 'company_branch_name',
      key: 'company_branch_name',
      sorter: true,

      className: 'text-xs',
      render: (_, { company_branch }) => company_branch?.name || null,
    },

    {
      title: 'Module',
      dataIndex: 'action_on',
      key: 'action_on',
      sorter: true,
      className: 'text-xs',

      render: (_, { action_on }) => formatLabel(action_on),
    },
    {
      title: 'Document No.',
      dataIndex: 'document_name',
      key: 'document_name',
      sorter: true,
      className: 'text-xs',

      render: (_, { document_name }) => document_name,
    },
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: true,
      className: 'text-xs',

      render: (_, { action_by_user }) => (
        <Tooltip title={action_by_user?.email}>{action_by_user?.user_name}</Tooltip>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      sorter: true,
      width: 100,
      className: ' text-xs',
      render: (_, { action, editable, id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={action}
            onBlur={(e) => onChange(id, 'action', e.target.value)}
          />
        ) : action == 'Delete' ? (
          <span className="w-13 mx-2 block rounded bg-rose-600 py-[2px] text-center text-xs text-white">
            {action}
          </span>
        ) : action == 'Update' ? (
          <span className="w-13 mx-2 block rounded bg-sky-700 py-[2px] text-center text-xs text-white">
            {action}
          </span>
        ) : (
          <span className="w-13 mx-2 block rounded bg-emerald-700 py-[2px] text-center text-xs text-white">
            {action}
          </span>
        ),
    },
    {
      title: 'Time',
      dataIndex: 'action_at',
      key: 'action_at',
      sorter: true,
      className: 'text-xs',
      width: 150,
      render: (_, { action_at }) => dayjs(action_at).format('DD-MMM-YYYY hh:mm'),
    },
  ];

  if (!permissions.edit && !permissions.delete && !permissions.add) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getAuditList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.sort_column, params.sort_direction, debouncedSearch]);

  return (
    <>
      <div className="p-2">
        <div className="flex items-center gap-2">
          <div>
            <p className="mb-1 text-xs text-gray-500">Reports</p>
            <h1 className="text-2xl font-medium">Audit Overview</h1>
          </div>
          <div className="h-1 w-1 animate-ping rounded-full bg-green-600"></div>
        </div>
        <div className="mt-2 flex w-fit items-center gap-1 rounded-md bg-gray-200 p-1">
          <Button type="primary" className="!bg-white text-xs !text-gray-950 shadow-none">
            Logs
          </Button>
          <Button type="primary" className="!bg-transparent text-xs !text-gray-800 shadow-none">
            Storage
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-white p-2">
        <div className="p-3">
          <Table
            size="small"
            rowHoverable={false}
            onChange={(page, _, sorting) => {
              dispatch(
                setBrandListParams({
                  page: page.current,
                  limit: page.pageSize,
                  sort_column: sorting.field,
                  sort_direction: sorting.order,
                }),
              );
            }}
            loading={isListLoading}
            rowKey="id"
            className="mt-2"
            scroll={{ x: 'calc(100% - 200px)' }}
            pagination={{
              total: paginationInfo.total_records,
              pageSize: params.limit,
              current: params.page,
              showTotal: (total) => `Total ${total} Actions`,
            }}
            dataSource={list}
            showSorterTooltip={false}
            columns={columns}
            sticky={{
              offsetHeader: 56,
            }}
          />
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these brand?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Brand;
