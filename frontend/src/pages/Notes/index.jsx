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
  addNewTerms,
  bulkDeleteTerms,
  createTerms,
  deleteTerms,
  getTermsList,
  removeNewTerms,
  setTermsDeleteIDs,
  setTermsEditable,
  setTermsListParams,
  updateTerms,
  updateTermsListValue
} from '../../store/features/termsSlice';

const Notes = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, isSubmitting, deleteIDs } =
    useSelector((state) => state.terms);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.terms;

  const debouncedSearch = useDebounce(params.search, 500);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onChange = (id, field, value) => {
    dispatch(updateTermsListValue({ id, field, value }));
  };

  const onCreate = async (record) => {
    const { name } = record;
    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(createTerms({ name })).unwrap();
      await dispatch(getTermsList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onUpdate = async (record) => {
    const { term_id, name } = record;

    if (!name.trim()) return toast.error('Name field is required');

    try {
      await dispatch(
        updateTerms({
          id: term_id,
          data: { name }
        })
      ).unwrap();
      await dispatch(getTermsList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancel = async (id) => {
    if (id === 'new') return dispatch(removeNewTerms());
    dispatch(setTermsEditable({ id, editable: false }));
  };

  const onTermsDelete = async (id) => {
    try {
      await dispatch(deleteTerms(id)).unwrap();
      toast.success('Note deleted successfully');
      dispatch(getTermsList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteTerms(deleteIDs)).unwrap();
      toast.success('Notes deleted successfully');
      closeDeleteModal();
      await dispatch(getTermsList(params)).unwrap();
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
      render: (_, { name, editable, term_id }) =>
        editable ? (
          <Input
            autoFocus
            defaultValue={name}
            onBlur={(e) => onChange(term_id, 'name', e.target.value)}
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
          dayjs(created_at).format('MM-DD-YYYY hh:mm A')
        ) : (
          <span className="text-gray-400">AUTO</span>
        )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const { term_id, editable } = record;

        if (editable) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip title="Cancel" onClick={() => onCancel(term_id)}>
                <Button danger icon={<FcCancel size={20} />} size="small" />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  size="small"
                  icon={<FaRegSave size={16} />}
                  loading={isSubmitting === term_id}
                  onClick={() => (term_id === 'new' ? onCreate(record) : onUpdate(record))}
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
                      setTermsEditable({
                        id: term_id,
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
                  onConfirm={() => onTermsDelete(term_id)}>
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
    dispatch(getTermsList(params)).unwrap().catch(handleError);
  }, [params.page, params.limit, params.sort_column, params.sort_direction, debouncedSearch]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>Notes</PageHeading>
        <Breadcrumb items={[{ title: 'Notes' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setTermsListParams({ search: e.target.value }))}
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
              <Button type="primary" onClick={() => dispatch(addNewTerms())}>
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
                  onChange: (selectedRowKeys) => dispatch(setTermsDeleteIDs(selectedRowKeys)),
                  getCheckboxProps: (record) => ({
                    disabled: record.term_id === 'new'
                  })
                }
              : null
          }
          onChange={(page, _, sorting) => {
            dispatch(
              setTermsListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          loading={isListLoading}
          rowKey="term_id"
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} notes`
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
        title="Are you sure you want to delete these notes?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Notes;
