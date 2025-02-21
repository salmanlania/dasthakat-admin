import { Breadcrumb, Button, Input, Popconfirm, Select, Table, Tag, Tooltip } from 'antd';
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
import useError from '../../hooks/useError';
import {
  bulkDeleteVendor,
  deleteVendor,
  getVendorList,
  setVendorDeleteIDs,
  setVendorListParams
} from '../../store/features/vendorSlice';

const Vendor = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.vendor
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.supplier;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedSupplierCode = useDebounce(params.supplier_code, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedLocation = useDebounce(params.location, 500);
  const debouncedContact1 = useDebounce(params.contact1, 500);
  const debouncedContact2 = useDebounce(params.contact2, 500);
  const debouncedEmail = useDebounce(params.email, 500);
  const debouncedAddress = useDebounce(params.address, 500);

  const onVendorDelete = async (id) => {
    try {
      await dispatch(deleteVendor(id)).unwrap();
      toast.success('Vendor deleted successfully');
      dispatch(getVendorList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteVendor(deleteIDs)).unwrap();
      toast.success('Vendors deleted successfully');
      closeDeleteModal();
      await dispatch(getVendorList(params)).unwrap();
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
            value={params.supplier_code}
            onChange={(e) => dispatch(setVendorListParams({ supplier_code: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'supplier_code',
      key: 'supplier_code',
      sorter: true,
      width: 120,
      ellipsis: true
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
            onChange={(e) => dispatch(setVendorListParams({ name: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 200,
      ellipsis: true
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
            allowClear
            value={params.status}
            onChange={(value) => dispatch(setVendorListParams({ status: value }))}
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
      title: (
        <div>
          <p>Location</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.location}
            onChange={(e) => dispatch(setVendorListParams({ location: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Contact 1</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.contact1}
            onChange={(e) => dispatch(setVendorListParams({ contact1: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'contact1',
      key: 'contact1',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Contact 2</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.contact2}
            onChange={(e) => dispatch(setVendorListParams({ contact2: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'contact2',
      key: 'contact2',
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
            onChange={(e) => dispatch(setVendorListParams({ email: e.target.value }))}
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
        <div>
          <p>Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.address}
            onChange={(e) => dispatch(setVendorListParams({ address: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'address',
      key: 'address',
      sorter: true,
      width: 200,
      ellipsis: true
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
      render: (_, { supplier_id }) => (
        <div className="flex items-center gap-2">
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/vendor/edit/${supplier_id}`}>
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
                onConfirm={() => onVendorDelete(supplier_id)}>
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
    dispatch(getVendorList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.status,
    debouncedSearch,
    debouncedSupplierCode,
    debouncedName,
    debouncedLocation,
    debouncedContact1,
    debouncedContact2,
    debouncedEmail,
    debouncedAddress
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>VENDOR</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setVendorListParams({ search: e.target.value }))}
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
              <Link to="/vendor/create">
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
                  onChange: (selectedRowKeys) => dispatch(setVendorDeleteIDs(selectedRowKeys))
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="supplier_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} vendors`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setVendorListParams({
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
        title="Are you sure you want to delete these vendors?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Vendor;
