// TODO: Add permission in this page
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
import useError from '../../hooks/useError';
import {
  bulkDeleteCommissionAgent,
  deleteCommissionAgent,
  getCommissionAgentList,
  setCommissionAgentDeleteIDs,
  setCommissionAgentListParams
} from '../../store/features/commissionAgentSlice';

// TODO:Remove mockData when api is created
const MOCK_DATA = [
  {
    commission_agent_id: 1,
    name: 'Commission Agent 1',
    address: 'Address 1',
    telephone: '1234567890',
    created_at: '2023-01-01T00:00:00Z',
    created_by: 1
  },
  {
    commission_agent_id: 2,
    name: 'Commission Agent 2',
    address: 'Address 2',
    telephone: '1234567891',
    created_at: '2023-01-02T00:00:00Z',
    created_by: 2
  },
  {
    commission_agent_id: 3,
    name: 'Commission Agent 3',
    address: 'Address 3',
    telephone: '1234567892',
    created_at: '2023-01-03T00:00:00Z',
    created_by: 3
  }
];

const CommissionAgent = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.commissionAgent
  );
  const { user } = useSelector((state) => state.auth);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedAddress = useDebounce(params.address, 500);
  const debouncedTelephone = useDebounce(params.telephone, 500);

  const onCommissionAgentDelete = async (id) => {
    try {
      // TODO:Uncomment next lines when api is created
      // await dispatch(deleteCommissionAgent(id)).unwrap();
      // toast.success('Commission Agent deleted successfully');
      // dispatch(getCommissionAgentList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      // TODO:Uncomment next lines when api is created
      // await dispatch(bulkDeleteCommissionAgent(deleteIDs)).unwrap();
      // toast.success('Commission Agents deleted successfully');
      closeDeleteModal();
      // await dispatch(getCommissionAgentList(params)).unwrap();
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
            onChange={(e) => dispatch(setCommissionAgentListParams({ name: e.target.value }))}
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
          <p>Telephone</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.telephone}
            onChange={(e) => dispatch(setCommissionAgentListParams({ telephone: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'telephone',
      key: 'telephone',
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
            onChange={(e) => dispatch(setCommissionAgentListParams({ address: e.target.value }))}
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
      title: (
        <div>
          <p>Telephone</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.telephone}
            onChange={(e) => dispatch(setCommissionAgentListParams({ telephone: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'telephone',
      key: 'telephone',
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
      render: (_, { commission_agent_id }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <Link to={`/commission-agent/edit/${commission_agent_id}`}>
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
              onConfirm={() => onCommissionAgentDelete(commission_agent_id)}>
              <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
      width: 70,
      fixed: 'right'
    }
  ];

  useEffect(() => {
    // TODO:Uncomment next line when api is created
    // dispatch(getCommissionAgentList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    debouncedSearch,
    debouncedName,
    debouncedAddress,
    debouncedTelephone
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>COMMISSION AGENT</PageHeading>
        <Breadcrumb items={[{ title: 'Commission Agent' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setCommissionAgentListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              danger
              onClick={() => setDeleteModalIsOpen(true)}
              disabled={!deleteIDs.length}>
              Delete
            </Button>

            <Link to="/commission-agent/create">
              <Button type="primary">Add New</Button>
            </Link>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: deleteIDs,
            onChange: (selectedRowKeys) => dispatch(setCommissionAgentDeleteIDs(selectedRowKeys))
          }}
          loading={isListLoading}
          className="mt-2"
          rowKey="commission_agent_id" // TODO:change rowKey corresponding api response
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} commission agents`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setCommissionAgentListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          dataSource={MOCK_DATA} // TODO:Remove mockData when api is created and use list state
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
        title="Are you sure you want to delete these commission agents?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default CommissionAgent;
