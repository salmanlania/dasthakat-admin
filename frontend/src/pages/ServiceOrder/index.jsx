import {
  Breadcrumb,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect/index.jsx';
import PageHeading from '../../components/Heading/PageHeading.jsx';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError.jsx';
import {
  bulkDeleteServiceOrder,
  deleteServiceOrder,
  getServiceOrderForPrint,
  getServiceOrderList,
  setServiceOrderDeleteIDs,
  setServiceOrderListParams,
} from '../../store/features/ServiceOrder.js';
import { createServiceOrderPrint } from '../../utils/prints/service-order-print.js';

const ServiceOrder = () => {
  useDocumentTitle('Service Order List');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const {
    list,
    isListLoading,
    params,
    paginationInfo,
    isBulkDeleting,
    deleteIDs,
    isFormSubmitting,
  } = useSelector((state) => state.serviceOrder);

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.service_order;
  const otherPermissions = user.permission;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(null);

  const [chargeData, setChargeData] = useState(null);
  const [chargeDataGetting, setChargeDataGetting] = useState(false);

  const [popupTitle, setPopupTitle] = useState('');

  const closeCreateModal = () => {
    setCreateModalIsOpen(null);
    setChargeData(null);
  };

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.document_identity, 500);
  const debouncedIMO = useDebounce(params.imo, 500);
  const debouncedQUOTATION = useDebounce(params.quotation_no, 500);
  const debouncedCHARGEORDERNO = useDebounce(params.charge_order_no, 500);
  const debouncedAGENT = useDebounce(params.agent_id, 500);

  const eventId = Form.useWatch('event_id', form);

  const onServiceOrderDelete = async (id) => {
    try {
      await dispatch(deleteServiceOrder(id)).unwrap();
      toast.success('Service Order deleted successfully');
      dispatch(getServiceOrderList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteServiceOrder(deleteIDs)).unwrap();
      toast.success('Service Orders deleted successfully');
      closeDeleteModal();
      await dispatch(getServiceOrderList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onProductCheck = (chargeId, chargeDetailId) => {
    const updatedChargeData = chargeData.map((charge) => {
      if (charge.charge_order_id === chargeId) {
        return {
          ...charge,
          details: charge.details.map((detail) => {
            if (detail.charge_order_detail_id === chargeDetailId) {
              return {
                ...detail,
                checked: detail.checked ? false : true,
              };
            }
            return detail;
          }),
        };
      }
      return charge;
    });

    setChargeData(updatedChargeData);
  };

  const onChargeCheck = (chargeId) => {
    const updatedChargeData = chargeData.map((charge) => {
      if (charge.charge_order_id === chargeId) {
        const allChecked = charge.details.every((detail) => detail.checked);

        return {
          ...charge,
          details: charge.details.map((detail) => ({
            ...detail,
            checked: !allChecked,
          })),
        };
      }
      return charge;
    });

    setChargeData(updatedChargeData);
  };

  const isAllChargeChecked = (chargeId) => {
    const charge = chargeData.find((charge) => charge.charge_order_id === chargeId);
    return charge ? charge.details.every((detail) => detail.checked) : false;
  };

  const printServiceOrder = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getServiceOrderForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createServiceOrderPrint(data);
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
            value={params.document_identity}
            onChange={(e) =>
              dispatch(setServiceOrderListParams({ document_identity: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 120,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            valueKey="event_id"
            labelKey="event_code"
            size="small"
            className="w-full font-normal"
            value={params.event_id}
            onChange={(value) => dispatch(setServiceOrderListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sales Team</p>
          <AsyncSelect
            endpoint="/sales-team"
            size="small"
            className="w-full font-normal"
            valueKey="sales_team_id"
            labelKey="name"
            mode="multiple"
            value={params.sales_team_ids}
            onChange={(value) => dispatch(setServiceOrderListParams({ sales_team_ids: value }))}
          />
        </div>
      ),
      dataIndex: 'sales_team_name',
      key: 'sales_team_name',
      sorter: true,
      width: 160,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Customer Name</p>
          <AsyncSelect
            endpoint="/customer"
            valueKey="customer_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.customer_id}
            onChange={(value) => dispatch(setServiceOrderListParams({ customer_id: value }))}
          />
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
          <p>Agent Name</p>
          <AsyncSelect
            endpoint="/agent"
            valueKey="agent_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.agent_id}
            onChange={(value) => dispatch(setServiceOrderListParams({ agent_id: value }))}
          />
        </div>
      ),
      sorter: true,
      dataIndex: 'agent_name',
      key: 'agent_name',
      width: 220,
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
            className="w-full font-normal"
            value={params.vessel_id}
            onChange={(value) => dispatch(setServiceOrderListParams({ vessel_id: value }))}
          />
        </div>
      ),
      sorter: true,
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      width: 220,
    },
    {
      title: (
        <div>
          <p>Charge Order No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.charge_order_no}
            onChange={(e) =>
              dispatch(setServiceOrderListParams({ charge_order_no: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'charge_order_no',
      key: 'charge_order_no',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (text, record) => (
        <span>
          {record.is_deleted === 1 ? (
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
          <p>Quotation No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.quotation_no}
            onChange={(e) => dispatch(setServiceOrderListParams({ quotation_no: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'quotation_no',
      key: 'quotation_no',
      sorter: true,
      width: 150,
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
      render: (record, { service_order_id }) => (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title="Print">
            <Link>
              <Button
                size="small"
                type="primary"
                className="bg-gray-500 hover:!bg-gray-400"
                icon={<FaRegFilePdf size={14} />}
                onClick={() => printServiceOrder(service_order_id)}
              />
            </Link>
          </Tooltip>
          {record.is_deleted !== 1 && permissions.delete ? (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete?"
                description="After deleting, You will not be able to recover it."
                okButtonProps={{ danger: true }}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onServiceOrderDelete(service_order_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 80,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getServiceOrderList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.event_id,
    params.sales_team_ids,
    params.sales_team_id,
    params.salesman_id,
    params.customer_id,
    params.vessel_id,
    params.flag_id,
    params.class1_id,
    params.class2_id,
    params.agent_id,
    debouncedSearch,
    debouncedCode,
    debouncedIMO,
    debouncedQUOTATION,
    debouncedCHARGEORDERNO,
    debouncedAGENT,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>SERVICE ORDER</PageHeading>
        <Breadcrumb items={[{ title: 'Service Order' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setServiceOrderListParams({ search: e.target.value }))}
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
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                type: 'checkbox',
                selectedRowKeys: deleteIDs,
                onChange: (selectedRowKeys) =>
                  dispatch(setServiceOrderDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="service_order_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} Orders`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setServiceOrderListParams({
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

      <Modal open={createModalIsOpen} onCancel={closeCreateModal} footer={null} title={popupTitle}>
        {chargeDataGetting && (
          <div className="flex justify-center py-24">
            <Spin />
          </div>
        )}

        {!chargeDataGetting && chargeData ? (
          <div className="mt-6">
            {chargeData.map((charge) => (
              <div className="relative rounded border p-2 pt-6" key={charge.charge_order_id}>
                <div
                  className="absolute -top-4 left-2 cursor-pointer rounded border bg-white p-1 px-2"
                  onClick={() => onChargeCheck(charge.charge_order_id)}>
                  <Checkbox checked={isAllChargeChecked(charge.charge_order_id)} />
                  <span className="ml-2">{charge.document_identity}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {charge.details?.map((detail) => (
                    <div
                      className="flex cursor-pointer justify-between rounded border bg-white p-1 px-2"
                      key={detail.charge_order_detail_id}
                      onClick={() =>
                        onProductCheck(charge.charge_order_id, detail.charge_order_detail_id)
                      }>
                      <div>
                        <Checkbox checked={detail.checked ? true : false} />
                        <span className="ml-2">{detail.product_description}</span>
                      </div>
                      <span className="ml-2">{parseFloat(detail?.available_quantity || 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these Orders?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default ServiceOrder;
