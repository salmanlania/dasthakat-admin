import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import { quotationStatusOptions } from '../../components/Form/QuotationForm.jsx';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
  bulkDeleteQuotation,
  deleteQuotation,
  getVendorQuotationList,
  setQuotationDeleteIDs,
  setVendorQuotationListParams,
} from '../../store/features/vendorQuotationSlice.js';

const VendorPlatform = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.vendorQuotation,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const [form] = Form.useForm();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);
  const debouncedCustomerRef = useDebounce(params.customer_ref, 500);
  const debouncedTotalAmount = useDebounce(params.total_amount, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null,
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteQuotation(id)).unwrap();
      toast.success('Quotation deleted successfully');
      dispatch(getVendorQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotation(deleteIDs)).unwrap();
      toast.success('Quotations deleted successfully');
      closeDeleteModal();
      await dispatch(getVendorQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>VQ #</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) => {
              const value = e.target.value || '';
              dispatch(setVendorQuotationListParams({ document_identity: value }))
            }}
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
        <div onClick={(e) => e.stopPropagation()}>
          <p>QT / CS</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.quotation_no}
            onChange={(e) => {
              dispatch(setVendorQuotationListParams({ quotation_no: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'quotation_no',
      key: 'quotation_no',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>RFQ / VSN</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setVendorQuotationListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 140,
      ellipsis: true,
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
            onChange={(value) => dispatch(setVendorQuotationListParams({ vessel_id: value }))}
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Date Required</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setVendorQuotationListParams({ document_date: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'date_required',
      key: 'date_required',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { date_required }) =>
        date_required ? dayjs(date_required).format('MM-DD-YYYY') : null,
    },
    {
      title: (
        <div>
          <p>Date Returned</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker
              size="small"
              value={params.document_date}
              className="font-normal"
              onChange={(date) => dispatch(setVendorQuotationListParams({ date_returned: date }))}
              format="MM-DD-YYYY"
            />
          </div>
        </div>
      ),
      dataIndex: 'date_returned',
      key: 'date_returned',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { date_returned }) =>
        date_returned ? dayjs(date_returned).format('MM-DD-YYYY') : null,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Person Incharge</p>
          {/* <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.person_incharge_name}
            onChange={(e) => {
              dispatch(setVendorQuotationListParams({ person_incharge_name: e.target.value }));
            }}
          /> */}
          <AsyncSelect
            endpoint="/user"
            size="small"
            className="w-full font-normal"
            valueKey="user_id"
            labelKey="user_name"
            value={params.person_incharge_name}
            onChange={(value) => dispatch(setVendorQuotationListParams({ person_incharge_name: value }))}
          />
        </div>
      ),
      dataIndex: 'person_incharge_name',
      key: 'person_incharge_name',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Status</p>
          <Select
            size="small"
            className="w-full font-normal"
            allowClear
            // options={quotationStatusOptions}
            value={params.status}
            onChange={(value) => dispatch(setVendorQuotationListParams({ status: value }))}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Items</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.total_items}
            onChange={(e) => {
              dispatch(setVendorQuotationListParams({ total_items: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'total_items',
      key: 'total_items',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Items Quoted</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.items_quoted}
            onChange={(e) => {
              dispatch(setVendorQuotationListParams({ items_quoted: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'items_quoted',
      key: 'items_quoted',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Date Sent</p>
          <Input
            className="font-normal"
            allowClear
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.date_sent}
            onChange={(e) => dispatch(setVendorQuotationListParams({ date_sent: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'date_sent',
      key: 'date_sent',
      sorter: true,
      width: 150,
      ellipsis: true,
      render: (_, { date_sent }) =>
        date_sent ? dayjs(date_sent).format('MM-DD-YYYY') : null,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vendor Code</p>
          <AsyncSelect
            endpoint="/event"
            size="small"
            className="w-full font-normal"
            valueKey="event_id"
            labelKey="event_code"
            value={params.event_id}
            onChange={(value) => dispatch(setVendorQuotationListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: (
        <div>
          <p>Intial Notif</p>
          <Input
            className="font-normal"
            size="small"
            allowClear
            onClick={(e) => e.stopPropagation()}
            value={params.total_amount}
            onChange={(e) => {
              dispatch(setVendorQuotationListParams({ total_amount: e.target.value }));
            }}
          />
        </div>
      ),
      dataIndex: 'total_amount',
      key: 'total_amount',
      sorter: true,
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { id }) => (
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1">
            {permissions.edit ? (
              <Tooltip title="View">
                <Link to={`/vendor-platform/edit/${id}`}>
                <Button
                  size="small"
                  type="primary"
                  className="bg-gray-500 hover:!bg-gray-400"
                  icon={<FaEye size={14} />}
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
                  onConfirm={() => onQuotationDelete(quotation_id)}>
                  <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                </Popconfirm>
              </Tooltip>
            ) : null}
          </div>
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
    console.log('list', list);
    window.scrollTo(0, 0);
    dispatch(getVendorQuotationList(formattedParams)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.customer_id,
    params.vessel_id,
    params.event_id,
    params.port_id,
    params.quotation_no,
    params.items_quoted,
    params.total_items,
    params.date_sent,
    params.status,
    params.person_incharge_name,
    debouncedSearch,
    debouncedQuotationNo,
    debouncedCustomerRef,
    debouncedTotalAmount,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>VENDOR PLATFORM</PageHeading>
        <Breadcrumb items={[{ title: 'Vendor Platform' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <Form form={form} name="quotation_report_form" layout="vertical">
          <div className="flex flex-wrap items-center justify-start gap-4 px-4">
            <div className="min-w-[150px]">
              <Input
                placeholder="Search..."
                allowClear
                className="sm:w-25 w-full"
                value={params.search}
                onChange={(e) => dispatch(setVendorQuotationListParams({ search: e.target.value }))}
              />
            </div>

            <div className="min-w-[150px]">
              <Form.Item name="date_range" label="Date Range" layout="vertical">
                <RangePicker
                  value={[
                    params.date_from && params.date_from !== ''
                      ? dayjs(params.date_from, 'YYYY-MM-DD')
                      : null,
                    params.date_to && params.date_to !== ''
                      ? dayjs(params.date_to, 'YYYY-MM-DD')
                      : null,
                  ]}
                  onChange={(dates) => {
                    const newParams = {
                      date_from: dates?.[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : '',
                      date_to: dates?.[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : '',
                    };

                    if (!dates || !dates[0] || !dates[1]) {
                      newParams.date_from = null;
                      newParams.date_to = null;
                    }

                    const fetchParams = { ...params, ...newParams, page: 1 };

                    dispatch(getVendorQuotationList(fetchParams));
                  }}
                  format="MM-DD-YYYY"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                type: 'checkbox',
                selectedRowKeys: deleteIDs,
                onChange: (selectedRowKeys) => dispatch(setQuotationDeleteIDs(selectedRowKeys)),
                getCheckboxProps: (record) => ({
                  disabled: record.isEventHeader,
                }),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey={(record) => record.document_identity}
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} vendor platform`,
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-start gap-2 px-4">
        <Button className="bg-sky-300 font-semibold text-black hover:bg-sky-400">
          Send Notifications
        </Button>
        <Button className="bg-amber-300 font-semibold text-black hover:bg-amber-400">
          Set VQs to Incomplete
        </Button>
        <Button className="bg-rose-300 font-semibold text-black hover:bg-rose-400">
          Cancel/Uncancel VQs
        </Button>
        <Button
          className="bg-gray-300 font-semibold text-black hover:bg-gray-400"
          onClick={() =>
            dispatch(getVendorQuotationList(formattedParams)).unwrap().catch(handleError)
          }>
          Refresh
        </Button>
        <Button className="bg-pink-300 font-semibold text-black hover:bg-pink-400">
          Change Req’d Date
        </Button>

        <span className="mr-2 text-sm font-medium">Req. Date:</span>
        <DatePicker size="small" format="MM/DD/YYYY" className="mr-4" />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these quotations?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default VendorPlatform;
