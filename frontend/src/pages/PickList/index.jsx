import { Button, Input, Select, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { LuListChecks } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import PickListReceiveModal from '../../components/Modals/PickListReceiveModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  getPickListForPrint,
  getPickListList,
  setPickListListParams,
  setPickListOpenModalId
} from '../../store/features/pickListSlice';
import { createPickListPrint } from '../../utils/prints/pick-list-print';

const pickListStatus = {
  1: 'Complete',
  2: 'In Complete',
  3: 'In Progress'
};

const PickList = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo } = useSelector((state) => state.pickList);
  const { user } = useSelector((state) => state.auth);

  // console.log('list' , list[0].created_at)
  const permissions = user.permission.picklist;

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedPickListNo = useDebounce(params.document_identity, 500);
  const debouncedTotalQuantity = useDebounce(params.total_quantity, 500);

  const printPickList = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getPickListForPrint(id)).unwrap();
      createPickListPrint(data);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

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
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            valueKey="event_id"
            labelKey="event_name"
            className="w-full font-normal"
            size="small"
            labelInValue
            onClick={(e) => e.stopPropagation()}
            value={params.event_id}
            onChange={(selected) =>
              dispatch(setPickListListParams({ event_id: selected ? selected.value : null }))
            }
            allowClear
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 180
    },
    {
      title: (
        <div>
          <p>Vessel</p>
          <AsyncSelect
            endpoint="/vessel"
            valueKey="vessel_id"
            labelKey="name"
            className="w-full font-normal"
            size="small"
            labelInValue
            onClick={(e) => e.stopPropagation()}
            value={params.vessel_id}
            onChange={(selected) =>
              dispatch(setPickListListParams({ vessel_id: selected ? selected.value : null }))
            }
            allowClear
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 180
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
            value={params.picklist_status}
            onChange={(value) => dispatch(setPickListListParams({ picklist_status: value }))}
            allowClear
          />
        </div>
      ),
      dataIndex: 'picklist_status',
      key: 'picklist_status',
      sorter: true,
      render: (_, { picklist_status }) => {
        if (picklist_status == 1) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="success" className="w-28 text-center">
                {pickListStatus[1]}
              </Tag>
            </div>
          );
        } else if (picklist_status == 2) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="volcano" className="w-28 text-center">
                {pickListStatus[2]}
              </Tag>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center">
              <Tag color="yellow" className="w-28 text-center">
                {pickListStatus[3]}
              </Tag>
            </div>
          );
        }
      },
      width: 140
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => {
        return dayjs(created_at).format('MM-DD-YYYY hh:mm A');
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { id }) => (
        <div className="flex items-center justify-center gap-2">
          {permissions.receive ? (
            <Tooltip title="Items Receive">
              <Button
                size="small"
                type="primary"
                icon={<LuListChecks size={18} />}
                onClick={() => dispatch(setPickListOpenModalId(id))}
              />
            </Tooltip>
          ) : null}
          <Tooltip title="Print">
            <Button
              size="small"
              type="primary"
              className="bg-rose-600 hover:!bg-rose-500"
              icon={<FaRegFilePdf size={14} />}
              onClick={() => printPickList(id)}
            />
          </Tooltip>
        </div>
      ),
      width: 80,
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
    params.event_id,
    params.vessel_id,
    params.picklist_status,
    debouncedSearch,
    debouncedPickListNo,
    debouncedTotalQuantity
  ]);

  const dataSource = list.map((item) => ({
    document_identity: item.document_identity,
    total_quantity: parseFloat(item?.total_quantity || 0),
    charge_order_no: item.charge_order_no,
    event_code: item.event_code,
    vessel_name: item?.vessel_name,
    picklist_status: item.picklist_status,
    created_at: item.created_at,
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
          placeholder="Search..." allowClear
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
            showTotal: (total) => `Total ${total} picklist`
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
