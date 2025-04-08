import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState , useMemo } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { LuClipboardList } from 'react-icons/lu';
import { HiRefresh } from 'react-icons/hi';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import PurchaseOrderModal from '../../components/Modals/PurchaseOrderModal';
import useDebounce from '../../hooks/useDebounce';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import useError from '../../hooks/useError';
import {
  bulkDeleteChargeOrder,
  createChargeOrderPO,
  deleteChargeOrder,
  getChargeOrderList,
  setChargeOrderDeleteIDs,
  setChargeOrderListParams
} from '../../store/features/chargeOrderSlice';
import { setChargePoID } from '../../store/features/purchaseOrderSlice';

const ChargeOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.chargeOrder
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.charge_order;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedDocNo = useDebounce(params.document_identity, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const groupedData = useMemo(() => {
    if (!list || !list.length) return []; 

    const result = [];
    const groupedByEvent = {};

    // Group data by event
    list.forEach((item) => {
      const eventCode = item.event_code || 'No Event';

      if (!groupedByEvent[eventCode]) {
        groupedByEvent[eventCode] = [];
      }

      groupedByEvent[eventCode].push(item);
    });

    // Convert to array with header rows
    Object.keys(groupedByEvent)
      .forEach((eventCode) => {
        // Add header row
        result.push({
          isEventHeader: true,
          event_code: eventCode,
          charge_order_id: `header-${eventCode}`
        });

        // Add data rows
        groupedByEvent[eventCode].forEach((item) => {
          result.push(item);
        });
      });

    return result;
  }, [list]);

  const onChargeOrderDelete = async (id) => {
    try {
      await dispatch(deleteChargeOrder(id)).unwrap();
      toast.success('Charge order deleted successfully');
      dispatch(getChargeOrderList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteChargeOrder(deleteIDs)).unwrap();
      toast.success('Charge orders deleted successfully');
      closeDeleteModal();
      await dispatch(getChargeOrderList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCreateChargePO = async (id) => {
    const loadingToast = toast.loading('PO is being processed...');
    try {
      await dispatch(createChargeOrderPO(id)).unwrap();
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}>
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <IoCheckmarkDoneCircleSharp size={40} className="text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Purchase Order has been created.
                  </p>
                  {permissions.edit ? (
                    <p
                      className="mt-1 cursor-pointer text-sm text-blue-500 hover:underline"
                      onClick={() => {
                        toast.dismiss(t.id);
                        navigate('/purchase-order');
                      }}>
                      View Details
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 8000
        }
      );
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
          <p>Charge Order Date</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setChargeOrderListParams({ document_date: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, { document_date }) =>
        document_date ? dayjs(document_date).format('MM-DD-YYYY') : null
    },
    {
      title: (
        <div>
          <p>Charge Order No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) =>
              dispatch(setChargeOrderListParams({ document_identity: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 180,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Customer</p>
          <AsyncSelect
            endpoint="/customer"
            size="small"
            className="w-full font-normal"
            valueKey="customer_id"
            labelKey="name"
            value={params.customer_id}
            onChange={(value) => dispatch(setChargeOrderListParams({ customer_id: value }))}
          />
        </div>
      ),
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessel</p>
          <AsyncSelect
            endpoint="/vessel"
            size="small"
            className="w-full font-normal"
            valueKey="vessel_id"
            labelKey="name"
            value={params.vessel_id}
            onChange={(value) => dispatch(setChargeOrderListParams({ vessel_id: value }))}
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setChargeOrderListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        if (record.isEventHeader) return null;
        return text;
      }
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
      render: (_, { charge_order_id }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Create PO">
            <Button
              size="small"
              type="primary"
              icon={<LuClipboardList size={14} />}
              onClick={() => dispatch(setChargePoID(charge_order_id))}
            />
          </Tooltip>

          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/charge-order/edit/${charge_order_id}`}>
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
                onConfirm={() => onChargeOrderDelete(charge_order_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}

          <Tooltip title="Charge Order">
            <Button
              size="small"
              type="primary"
              icon={<HiRefresh  size={14} />}
            />
          </Tooltip>
        </div>
      ),
      width: 105,
      fixed: 'right'
    }
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getChargeOrderList(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.vessel_id,
    params.event_id,
    debouncedSearch,
    debouncedDocNo
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>CHARGE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Charge Order' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setChargeOrderListParams({ search: e.target.value }))}
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
              <Link to="/charge-order/create">
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
                  onChange: (selectedRowKeys) => dispatch(setChargeOrderDeleteIDs(selectedRowKeys)),
                  getCheckboxProps: (record) => ({
                    disabled: record.isEventHeader,
                    name: record.charge_order_id,
                  }),
                }
              : null
          }
          loading={isListLoading}
          className="event-grouped-table mt-2"
          // rowKey="charge_order_id"
          rowKey={(record) =>
            record.isEventHeader ? record.charge_order_id : record.charge_order_id
          }
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} charge orders`
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setChargeOrderListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field || params.sort_column,
                sort_direction: sorting.order || params.sort_direction
              })
            );
          }}
          // dataSource={list}
          dataSource={groupedData}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56
          }}
          onRow={(record) => {
            return {
              className: record.isEventHeader ? 'event-header-row' : ''
            };
          }}
          components={{
            body: {
              row: (props) => {
                const { children, className, ...restProps } = props;

                if (className && className.includes('event-header-row')) {
                  const eventCode = props['data-row-key'].replace('header-', '');
                  return (
                    <tr {...restProps} className="event-header-row bg-[#fafafa] font-bold">
                      <td colSpan={columns.length + (permissions.delete ? 1 : 0)} className="text-md px-4 py-2 text-[#285198]">
                        {eventCode !== 'No Event' ? `Event: ${eventCode}` : 'No Event Assigned'}
                      </td>
                    </tr>
                  );
                }

                return <tr {...props} />;
              }
            }
          }}
        />
      </div>

      <PurchaseOrderModal />

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these charge orders?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default ChargeOrder;
