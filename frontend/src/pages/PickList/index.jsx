import { Button, Input, Select, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { LuHand, LuListChecks } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import PickListReceiveModal from '../../components/Modals/PickListReceiveModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  getPickListList,
  setPickListListParams,
  setPickListOpenModalId
} from '../../store/features/pickListSlice';

const pickListStatus = {
  1: 'Complete',
  2: 'In Complete',
  3: 'In Progress'
};

const PickList = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo } = useSelector((state) => state.pickList);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedPickListNo = useDebounce(params.document_identity, 500);
  const debouncedTotalQuantity = useDebounce(params.total_quantity, 500);

  const columns = [
    {
      title: (
        <div>
          <p>Pick List No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) => dispatch(setPickListListParams({ document_identity: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: (
        <div>
          <p>Charge Order</p>
          <AsyncSelect
            endpoint="/charge-order"
            valueKey="charge_order_id"
            labelKey="document_identity"
            className="w-full font-normal"
            params={{
              include_other: 0
            }}
            size="small"
            labelInValue
            onClick={(e) => e.stopPropagation()}
            value={params.charge_order_id}
            onChange={(selected) =>
              dispatch(setPickListListParams({ charge_order_id: selected ? selected.value : null }))
            }
            allowClear
          />
        </div>
      ),
      dataIndex: 'charge_order_no',
      key: 'charge_order_no',
      sorter: true,
      width: 180
    },
    {
      title: (
        <div>
          <p>Total Quantity</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.total_quantity}
            onChange={(e) => dispatch(setPickListListParams({ total_quantity: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      sorter: true,
      width: 150,
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
                label: pickListStatus[1]
              },
              {
                value: 2,
                label: pickListStatus[2]
              },
              {
                value: 3,
                label: pickListStatus[3]
              }
            ]}
            value={params.status}
            onChange={(value) => dispatch(setCurrencyListParams({ status: value }))}
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
      render: (_, { id }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Items Receive">
            <Button
              size="small"
              type="primary"
              icon={<LuListChecks size={18} />}
              onClick={() => dispatch(setPickListOpenModalId(id))}
            />
          </Tooltip>
        </div>
      ),
      width: 70,
      fixed: 'right'
    }
  ];

  useEffect(() => {
    dispatch(getPickListList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.charge_order_id,
    debouncedSearch,
    debouncedPickListNo,
    debouncedTotalQuantity
  ]);

  const dataSource = list.map((item) => ({
    document_identity: item.document_identity,
    total_quantity: item.total_quantity,
    charge_order_no: item.charge_order?.document_identity,
    id: item.picklist_id,
    key: item.picklist_id
  }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>PICK LIST</PageHeading>
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <Input
          placeholder="Search..."
          className="w-full sm:w-64"
          value={params.search}
          onChange={(e) => dispatch(setPickListListParams({ search: e.target.value }))}
        />

        <Table
          size="small"
          loading={isListLoading}
          className="mt-2"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} companies`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setPickListListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          dataSource={dataSource}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
        />
      </div>

      <PickListReceiveModal />
    </>
  );
};

export default PickList;
