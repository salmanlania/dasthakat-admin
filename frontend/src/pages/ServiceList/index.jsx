import { Button, Input, Select, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { LuListChecks } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import ServiceListReceiveModal from '../../components/Modals/ServiceListReceiveModal';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useError from '../../hooks/useError';
import {
  getServiceListForPrint,
  getServiceListList,
  setServiceListListParams,
  setServiceListOpenModalId,
} from '../../store/features/serviceListSlice';
import { createServiceListPrint } from '../../utils/prints/service-list-print';

const serviceListStatus = {
  1: 'Complete',
  2: 'In Complete',
  3: 'In Progress',
  4: 'Cancelled',
};

const ServiceList = () => {
  useDocumentTitle('Service List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo } = useSelector((state) => state.serviceList);
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.servicelist;

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedServiceListNo = useDebounce(params.document_identity, 500);
  const debouncedTotalQuantity = useDebounce(params.total_quantity, 500);

  const printServiceList = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getServiceListForPrint(id)).unwrap();
      createServiceListPrint(data);
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
          <p>Service List No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(setServiceListListParams({ document_identity: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 150,
      ellipsis: true,
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
              include_other: 0,
            }}
            size="small"
            labelInValue
            onClick={(e) => e.stopPropagation()}
            value={params.charge_order_id}
            onChange={(selected) =>
              dispatch(
                setServiceListListParams({ charge_order_id: selected ? selected.value : null }),
              )
            }
            allowClear
          />
        </div>
      ),
      dataIndex: 'charge_order_no',
      key: 'charge_order_no',
      sorter: true,
      width: 180,
      render: (text, record) => (
        <span>
          {record.isDeleted === 1 ? (
            <>
              {text} <span style={{ color: 'red' }}>(Cancelled)</span>
            </>
          ) : (
            text
          )}
        </span>
      ),
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
            onChange={(e) => dispatch(setServiceListListParams({ total_quantity: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      sorter: true,
      width: 150,
      ellipsis: true,
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
              dispatch(setServiceListListParams({ event_id: selected ? selected.value : null }))
            }
            allowClear
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 180,
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
              dispatch(setServiceListListParams({ vessel_id: selected ? selected.value : null }))
            }
            allowClear
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 180,
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
                label: serviceListStatus[1],
              },
              {
                value: 2,
                label: serviceListStatus[2],
              },
              {
                value: 3,
                label: serviceListStatus[3],
              },
              {
                value: 4,
                label: serviceListStatus[4],
              },
            ]}
            value={params.servicelist_status}
            onChange={(value) => dispatch(setServiceListListParams({ servicelist_status: value }))}
            allowClear
          />
        </div>
      ),
      dataIndex: 'servicelist_status',
      key: 'servicelist_status',
      sorter: true,
      render: (_, { servicelist_status }) => {
        if (servicelist_status == 1) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="green" className="w-28 text-center">
                {serviceListStatus[1]}
              </Tag>
            </div>
          );
        } else if (servicelist_status == 2) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="blue" className="w-28 text-center">
                {serviceListStatus[2]}
              </Tag>
            </div>
          );
        } else if (servicelist_status == 3) {
          return (
            <div className="flex items-center justify-center">
              <Tag color="orange" className="w-28 text-center">
                {serviceListStatus[3]}
              </Tag>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center">
              <Tag color="volcano" className="w-28 text-center">
                {serviceListStatus[4]}
              </Tag>
            </div>
          );
        }
      },
      width: 140,
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
      render: (record, { id }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            {record.isDeleted !== 1 && permissions.receive ? (
              <Tooltip title="Items Receive">
                <Button
                  size="small"
                  type="primary"
                  icon={<LuListChecks size={18} />}
                  onClick={() => dispatch(setServiceListOpenModalId(id))}
                />
              </Tooltip>
            ) : null}
            <Tooltip title="Print">
              <Button
                size="small"
                type="primary"
                className="bg-rose-600 hover:!bg-rose-500"
                icon={<FaRegFilePdf size={14} />}
                onClick={() => printServiceList(id)}
              />
            </Tooltip>
          </div>
        )
      },
      width: 80,
      fixed: 'right',
    },
  ];

  useEffect(() => {
    dispatch(getServiceListList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.charge_order_id,
    params.event_id,
    params.vessel_id,
    params.servicelist_status,
    debouncedSearch,
    debouncedServiceListNo,
    debouncedTotalQuantity,
  ]);

  const dataSource = list.map((item) => ({
    document_identity: item.document_identity,
    total_quantity: parseFloat(item?.total_quantity || 0),
    charge_order_no: item.charge_order_no,
    event_code: item.event_code,
    vessel_name: item?.vessel_name,
    servicelist_status: item.servicelist_status,
    id: item.servicelist_id,
    key: item.servicelist_id,
    isDeleted: item.is_deleted,
    created_at: item.created_at,
  }));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>SERVICE LIST</PageHeading>
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <Input
          placeholder="Search..."
          allowClear
          className="w-full sm:w-64"
          value={params.search}
          onChange={(e) => dispatch(setServiceListListParams({ search: e.target.value }))}
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
            showTotal: (total) => `Total ${total} servicelist`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setServiceListListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
            );
          }}
          dataSource={dataSource}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <ServiceListReceiveModal />
    </>
  );
};

export default ServiceList;
