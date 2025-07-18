import { Breadcrumb, Button, Input, Popconfirm, Select, Table, Tooltip } from 'antd';
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
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import {
  bulkDeleteVessel,
  deleteVessel,
  getVesselList,
  setVesselDeleteIDs,
  setVesselListParams,
} from '../../store/features/vesselSlice';

const Vessel = () => {
  useDocumentTitle('Vessel List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.vessel,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.vessel;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedIMO = useDebounce(params.imo, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedBillingAddress = useDebounce(params.billing_address, 500);

  const onVesselDelete = async (id) => {
    try {
      await dispatch(deleteVessel(id)).unwrap();
      toast.success('Vessel deleted successfully');
      dispatch(getVesselList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteVessel(deleteIDs)).unwrap();
      toast.success('Vessels deleted successfully');
      closeDeleteModal();
      await dispatch(getVesselList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>IMO</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.imo}
            onChange={(e) => dispatch(setVesselListParams({ imo: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'imo',
      key: 'imo',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) => dispatch(setVesselListParams({ name: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Customer</p>
          <AsyncSelect
            endpoint="/customer"
            size="small"
            labelKey="name"
            valueKey="customer_id"
            className="w-full font-normal"
            value={params.customer_id}
            onChange={(value) => dispatch(setVesselListParams({ customer_id: value }))}
          />
          <Select size="small" className="w-full font-normal" />
        </div>
      ),
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Flag</p>
          <AsyncSelect
            endpoint="/flag"
            size="small"
            labelKey="name"
            valueKey="flag_id"
            className="w-full font-normal"
            value={params.flag_id}
            onChange={(value) => dispatch(setVesselListParams({ flag_id: value }))}
          />
          <Select size="small" className="w-full font-normal" />
        </div>
      ),
      dataIndex: 'flag_name',
      key: 'flag_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 1</p>
          <AsyncSelect
            endpoint="/class"
            size="small"
            className="w-full font-normal"
            valueKey="class_id"
            labelKey="name"
            value={params.class1_id}
            onChange={(value) => dispatch(setVesselListParams({ class1_id: value }))}
          />
          <Select size="small" className="w-full font-normal" />
        </div>
      ),
      dataIndex: 'class1_name',
      key: 'class1_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 2</p>
          <AsyncSelect
            endpoint="/class"
            size="small"
            valueKey="class_id"
            labelKey="name"
            className="w-full font-normal"
            value={params.class2_id}
            onChange={(value) => dispatch(setVesselListParams({ class2_id: value }))}
          />
          <Select size="small" className="w-full font-normal" />
        </div>
      ),
      dataIndex: 'class2_name',
      key: 'class2_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Billing Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.billing_address}
            onChange={(e) => dispatch(setVesselListParams({ billing_address: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'billing_address',
      key: 'billing_address',
      sorter: true,
      width: 200,
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
      render: (_, { vessel_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/vessel/edit/${vessel_id}`}>
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
                onConfirm={() => onVesselDelete(vessel_id)}>
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

  useEffect(() => {
    dispatch(getVesselList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.customer_id,
    params.flag_id,
    params.class1_id,
    params.class2_id,
    debouncedSearch,
    debouncedName,
    debouncedIMO,
    debouncedBillingAddress,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>VESSEL</PageHeading>
        <Breadcrumb items={[{ title: 'Vessel' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setVesselListParams({ search: e.target.value }))}
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
              <Link to="/vessel/create">
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
                  onChange: (selectedRowKeys) => dispatch(setVesselDeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="vessel_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} vessels`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setVesselListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
            );
          }}
          dataSource={list}
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
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these vessels?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Vessel;
