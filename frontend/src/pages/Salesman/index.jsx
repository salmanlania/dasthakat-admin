import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegSave } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  addNewSalesman,
  bulkDeleteSalesman,
  createSalesman,
  deleteSalesman,
  getSalesmanList,
  removeNewSalesman,
  setSalesmanDeleteIDs,
  setSalesmanEditable,
  setSalesmanListParams,
  updateSalesman,
  updateSalesmanListValue
} from '../../store/features/salesmanSlice';

const Salesman = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, isSubmitting, deleteIDs } =
    useSelector((state) => state.salesman);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.salesman;

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedCM = useDebounce(params.commission_percentage, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updateSalesmanListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name, commission_percentage } = record;
    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(createSalesman({ name, commission_percentage })).unwrap();
      await dispatch(getSalesmanList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { salesman_id, name, commission_percentage } = record;

    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(
        updateSalesman({
          id: salesman_id,
          data: { name, commission_percentage }
        })
      ).unwrap();
      await dispatch(getSalesmanList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === 'new') return dispatch(removeNewSalesman());
    dispatch(setSalesmanEditable({ id, editable: false }));
  };

  const onSalesmanDelete = async (id) => {
    try {
      await dispatch(deleteSalesman(id)).unwrap();
      toast.success('Salesman deleted successfully');
      dispatch(getSalesmanList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteSalesman(deleteIDs)).unwrap();
      toast.success('Salesman deleted successfully');
      closeDeleteModal();
      await dispatch(getSalesmanList(params)).unwrap();
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
            onChange={(e) => dispatch(setSalesmanListParams({ name: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, salesman_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(salesman_id, 'name', e.target.value)}
          />
        ) : (
          <span>{name}</span>
        )
    },
    {
      title: (
        <div>
          <p>Commission Percentage</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.commission_percentage}
            onChange={(e) =>
              dispatch(setSalesmanListParams({ commission_percentage: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'commission_percentage',
      key: 'commission_percentage',
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { commission_percentage, editable, salesman_id }) =>
        editable ? (
          <Input
            defaultValue={commission_percentage}
            onBlur={(e) => onChange(salesman_id, 'commission_percentage', e.target.value)}
          />
        ) : (
          <span>{commission_percentage}</span>
        )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) =>
        created_at ? (
          dayjs(created_at).format('MM-DD-YYYY hh:mm A')
        ) : (
          <span className="text-gray-400">AUTO</span>
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const { salesman_id, editable } = record;

        if (editable) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Cancel" onClick={() => onCancel(salesman_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === salesman_id}
                  onClick={() => (salesman_id === 'new' ? onCreate(record) : onUpdate(record))}
                />
              </Tooltip>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            {permissions.edit ? (
              <Tooltip title="Edit">
                <Button
                  size="small"
                  type="primary"
                  className="bg-gray-500 hover:!bg-gray-400"
                  icon={<MdOutlineEdit size={14} />}
                  onClick={() =>
                    dispatch(
                      setSalesmanEditable({
                        id: salesman_id,
                        editable: true
                      })
                    )
                  }
                />
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
                  onConfirm={() => onSalesmanDelete(salesman_id)}>
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
        );
      },
      width: 70,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete && !permissions.add) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getSalesmanList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
    debouncedName,
    debouncedCM
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>SALESMAN</PageHeading>
        <Breadcrumb items={[{ title: 'Salesman' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..." allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setSalesmanListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled={!deleteIDs.length}>
              Delete
            </Button>
            {permissions.add ? (
              <Button type="primary" onClick={() => dispatch(addNewSalesman())}>
                Add New
              </Button>
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
                  onChange: (selectedRowKeys) => dispatch(setSalesmanDeleteIDs(selectedRowKeys)),
                  getCheckboxProps: (record) => ({
                    disabled: record.salesman_id === 'new'
                  })
                }
              : null
          }
          onChange={(page, _, sorting) => {
            dispatch(
              setSalesmanListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          loading={isListLoading}
          rowKey="salesman_id"
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} salesman`
          }}
          dataSource={list}
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
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these salesman?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Salesman;
