import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegSave } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import PageHeading from '../../components/heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  addNewPayment,
  bulkDeletePayment,
  createPayment,
  deletePayment,
  getPaymentList,
  removeNewPayment,
  setPaymentDeleteIDs,
  setPaymentEditable,
  setPaymentListParams,
  updatePayment,
  updatePaymentListValue
} from '../../store/features/paymentSlice';

const Payment = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, isSubmitting, deleteIDs } =
    useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.payment;

  const debouncedSearch = useDebounce(params.search, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updatePaymentListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(createPayment({ name })).unwrap();
      await dispatch(getPaymentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { payment_id, name } = record;

    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(
        updatePayment({
          id: payment_id,
          data: { name }
        })
      ).unwrap();
      await dispatch(getPaymentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === 'new') return dispatch(removeNewPayment());
    dispatch(setPaymentEditable({ id, editable: false }));
  };

  const onPaymentDelete = async (id) => {
    try {
      await dispatch(deletePayment(id)).unwrap();
      toast.success('Payment deleted successfully');
      dispatch(getPaymentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeletePayment(deleteIDs)).unwrap();
      toast.success('Payment deleted successfully');
      closeDeleteModal();
      await dispatch(getPaymentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 120,
      ellipsis: true,
      render: (_, { name, editable, payment_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(payment_id, 'name', e.target.value)}
          />
        ) : (
          <span>{name}</span>
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
          dayjs(created_at).format('DD-MM-YYYY hh:mm A')
        ) : (
          <span className="text-gray-400">AUTO</span>
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const { payment_id, editable } = record;

        if (editable) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Cancel" onClick={() => onCancel(payment_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === payment_id}
                  onClick={() => (payment_id === 'new' ? onCreate(record) : onUpdate(record))}
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
                      setPaymentEditable({
                        id: payment_id,
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
                  onConfirm={() => onPaymentDelete(payment_id)}
                >
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

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getPaymentList(params)).unwrap().catch(handleError);
  }, [params.page, params.limit, params.sort_column, params.sort_direction, debouncedSearch]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>PAYMENT</PageHeading>
        <Breadcrumb items={[{ title: 'Payment' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setPaymentListParams({ search: e.target.value }))}
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
            {permissions.add ? (
              <Button type="primary" onClick={() => dispatch(addNewPayment())}>
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
                  onChange: (selectedRowKeys) => dispatch(setPaymentDeleteIDs(selectedRowKeys)),
                  getCheckboxProps: (record) => ({
                    disabled: record.payment_id === 'new'
                  })
                }
              : null
          }
          onChange={(page, _, sorting) => {
            dispatch(
              setPaymentListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          loading={isListLoading}
          rowKey="payment_id"
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} payment`
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
        title="Are you sure you want to delete these payment?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Payment;
