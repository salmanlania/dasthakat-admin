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
import CountrySelect from '../../components/Select/CountrySelect';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  bulkDeleteIJO,
  deleteIJO,
  getIJOList,
  setIJODeleteIDs,
  setIJOListParams
} from '../../store/features/ijoSlice';

const IJO = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.ijo
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.job_order;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.IJO_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedAddress = useDebounce(params.address, 500);
  const debouncedPhone = useDebounce(params.phone_no, 500);
  const debouncedEmailSales = useDebounce(params.email_sales, 500);
  const debouncedEmailAccounting = useDebounce(params.email_accounting, 500);
  const debouncedBillingAddress = useDebounce(params.billing_address, 500);

  const onIJODelete = async (id) => {
    try {
      await dispatch(deleteIJO(id)).unwrap();
      toast.success('Internal Job Order deleted successfully');
      dispatch(getIJOList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteIJO(deleteIDs)).unwrap();
      toast.success('Internal Job Orders deleted successfully');
      closeDeleteModal();
      await dispatch(getIJOList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.IJO_code}
            onChange={(e) => dispatch(setIJOListParams({ IJO_code: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'IJO_code',
      key: 'IJO_code',
      sorter: true,
      width: 120,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            valueKey="event_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.event_id}
            onChange={(value) => dispatch(setIJOListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_name',
      key: 'event_name',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sales Person</p>
          <AsyncSelect
            endpoint="/sales_person"
            valueKey="sales_person_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.sales_person_id}
            onChange={(value) => dispatch(setIJOListParams({ sales_person_id: value }))}
          />
        </div>
      ),
      dataIndex: 'sales_person_name',
      key: 'sales_person_name',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessels</p>
          <AsyncSelect
            endpoint="/vessel"
            valueKey="vessel_id"
            labelKey="name"
            size="small"
            mode="multiple"
            className="w-full font-normal"
            value={params.vessel_id}
            onChange={(value) => dispatch(setIJOListParams({ vessel_id: value }))}
          />
        </div>
      ),
      dataIndex: 'vessel',
      key: 'vessel',
      width: 220,
      render: (_, { vessel }) => (vessel ? vessel.map((v) => v.name).join(', ') : null)
    },
    {
      title: (
        <div>
          <p>IMO</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.imo}
            onChange={(e) => dispatch(setIJOListParams({ imo: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'imo',
      key: 'imo',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Flag</p>
          <AsyncSelect
            endpoint="/flag"
            valueKey="flag_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.flag_id}
            onChange={(value) => dispatch(setIJOListParams({ flag_id: value }))}
          />
        </div>
      ),
      dataIndex: 'flag',
      key: 'flag',
      width: 150
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 2</p>
          <AsyncSelect
            endpoint="/class2"
            valueKey="class2_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.class2_id}
            onChange={(value) => dispatch(setIJOListParams({ class2_id: value }))}
          />
        </div>
      ),
      dataIndex: 'class2',
      key: 'class2',
      width: 150
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Agent</p>
          <AsyncSelect
            endpoint="/agent"
            valueKey="agent_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.agent_id}
            onChange={(value) => dispatch(setIJOListParams({ agent_id: value }))}
          />
        </div>
      ),
      dataIndex: 'agent',
      key: 'agent',
      width: 150
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
      render: (_, { ijo_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/ijo/edit/${ijo_id}`}>
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
                onConfirm={() => onIJODelete(ijo_id)}>
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
    dispatch(getIJOList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.status,
    params.salesman_id,
    params.vessel_id,
    params.country,
    debouncedSearch,
    debouncedCode,
    debouncedName,
    debouncedAddress,
    debouncedPhone,
    debouncedEmailSales,
    debouncedEmailAccounting,
    debouncedBillingAddress
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>INTERNAL JOB ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Internal Job Order' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setIJOListParams({ search: e.target.value }))}
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
              <Link to="/ijo/create">
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
                  onChange: (selectedRowKeys) => dispatch(setIJODeleteIDs(selectedRowKeys))
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="ijo_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} internal job orders`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setIJOListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
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
        title="Are you sure you want to delete these internal job orders?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default IJO;
