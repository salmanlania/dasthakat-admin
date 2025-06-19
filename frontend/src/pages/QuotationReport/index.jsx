import { Breadcrumb, Button, DatePicker, Input, Popconfirm, Select, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import { quotationStatusOptions } from '../../components/Form/QuotationForm.jsx';
import PageHeading from '../../components/Heading/PageHeading';
import ChargeOrderModal from '../../components/Modals/ChargeOrderModal';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import { setChargeQuotationID } from '../../store/features/chargeOrderSlice';
import {
  bulkDeleteQuotation,
  deleteQuotation,
  getQuotationForPrint,
  getQuotationList,
  setQuotationDeleteIDs,
  setQuotationListParams
} from '../../store/features/quotationSlice';
import generateQuotationExcel from '../../utils/excel/quotation-excel.js';
import { createQuotationPrint } from '../../utils/prints/quotation-print';

import { FaRegFileExcel } from 'react-icons/fa6';
import { FaRegFilePdf } from 'react-icons/fa';

const QuotationReport = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.quotation
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.quotation;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedQuotationNo = useDebounce(params.document_identity, 500);
  const debouncedCustomerRef = useDebounce(params.customer_ref, 500);

  const formattedParams = {
    ...params,
    document_date: params.document_date ? dayjs(params.document_date).format('YYYY-MM-DD') : null
  };

  const onQuotationDelete = async (id) => {
    try {
      await dispatch(deleteQuotation(id)).unwrap();
      toast.success('Quotation deleted successfully');
      dispatch(getQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotation(deleteIDs)).unwrap();
      toast.success('Quotations deleted successfully');
      closeDeleteModal();
      await dispatch(getQuotationList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printQuotation = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getQuotationForPrint(id)).unwrap();
      createQuotationPrint(data);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const exportQuotation = async (id) => {
    const loadingToast = toast.loading('Loading excel...');

    try {
      const data = await dispatch(getQuotationForPrint(id)).unwrap();
      generateQuotationExcel(data);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const columns = [
    {
      title: 'Event Number',
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 140,
      ellipsis: true
    },
    {
      title: 'Quotation No',
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: 'Vessel',
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      sorter: true,
      width: 140,
      ellipsis: true
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 200,
      ellipsis: true
    },
    {
      title: 'Total Quantity',
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 140,
      ellipsis: true
    },
    {
      title: 'Total Amount',
      dataIndex: 'customer_name',
      key: 'customer_name',
      sorter: true,
      width: 140,
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
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    const hasDateFilter = params.start_date && params.end_date;
    // dispatch(getQuotationList(formattedParams)).unwrap().catch(handleError);
    if (hasDateFilter) {
      dispatch(getQuotationList(formattedParams)).unwrap().catch(handleError);
    }

    const savedLimit = sessionStorage.getItem('quotationLimit');
    if (savedLimit && +savedLimit !== params.limit) {
      dispatch(setQuotationListParams({ limit: +savedLimit }));
    }
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
    params.port_id,
    params.start_date,       // ✅ add this
    params.end_date,
    params.status,
    debouncedSearch,
    debouncedQuotationNo,
    debouncedCustomerRef
  ]);

  const groupedQuotationData = useMemo(() => {
    if (!list || !list.length) return [];

    const result = [];
    const groupedByEvent = {};

    list.forEach((item) => {
      const eventCode = item.event_code || 'No Event';

      if (!groupedByEvent[eventCode]) {
        groupedByEvent[eventCode] = [];
      }

      groupedByEvent[eventCode].push(item);
    });

    Object.keys(groupedByEvent).forEach((eventCode) => {
      result.push({
        isEventHeader: true,
        event_code: eventCode,
        quotation_id: `header-${eventCode}`
      });

      groupedByEvent[eventCode].forEach((item) => {
        result.push(item);
      });
    });

    return result;
  }, [list]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>QUOTATION REPORT</PageHeading>
        <Breadcrumb items={[{ title: 'Quotation Report' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center gap-1 justify-between flex-wrap">
          <Input
            placeholder="Search..." allowClear
            className="w-full sm:w-60"
            value={params.search}
            onChange={(e) => dispatch(setQuotationListParams({ search: e.target.value }))}
          />
          <div className="min-w-[140px]">
            <RangePicker
              value={[
                params.start_date && params.start_date !== ''
                  ? dayjs(params.start_date, 'YYYY-MM-DD')
                  : null,
                params.end_date && params.end_date !== ''
                  ? dayjs(params.end_date, 'YYYY-MM-DD')
                  : null
              ]}
              onChange={(dates) => {
                const newParams = {
                  start_date: dates?.[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : '',
                  end_date: dates?.[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : ''
                };

                const start = dates?.[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : '';
                const end = dates?.[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : '';


                const today = dayjs().format('YYYY-MM-DD');
                const fetchParams = { ...params };
                if (dates && dates[0]) {
                  fetchParams.start_date = newParams.start_date;
                  fetchParams.end_date = newParams.end_date;
                } else {
                  if (!isOldChecked) {
                    fetchParams.start_date = today;
                    fetchParams.end_date = null;
                  } else {
                    fetchParams.start_date = null;
                    fetchParams.end_date = null;
                  }
                }
                dispatch(setQuotationListParams({
                  start_date: start,
                  end_date: end,
                  page: 1
                }));
              }}
              format="MM-DD-YYYY"
            />
          </div>

          {/* <div className="flex flex-wrap items-center gap-4"> */}
          <div className="min-w-[140px]">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Event Number</label> */}
            <AsyncSelect
              endpoint="/event"
              className="w-full"
              valueKey="event_id"
              labelKey="event_code"
              placeholder="Select Event"
              value={params.event_id}
              onChange={(value) => dispatch(setQuotationListParams({ event_id: value }))}
              allowClear
            />
          </div>

          <div className="min-w-[100px]">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Quotation No</label> */}
            <Input
              placeholder="Enter Quotation No"
              allowClear
              value={params.document_identity}
              onChange={(e) =>
                dispatch(setQuotationListParams({ document_identity: e.target.value }))
              }
            />
          </div>

          <div className="min-w-[14px]">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Vessel</label> */}
            <AsyncSelect
              endpoint="/vessel"
              className="w-full"
              valueKey="vessel_id"
              labelKey="name"
              placeholder="Select Vessel"
              value={params.vessel_id}
              onChange={(value) => dispatch(setQuotationListParams({ vessel_id: value }))}
              allowClear
            />
          </div>

          <div className="min-w-[200px]">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label> */}
            <AsyncSelect
              endpoint="/customer"
              className="w-full"
              valueKey="customer_id"
              labelKey="name"
              placeholder="Select Customer"
              value={params.customer_id}
              onChange={(value) => dispatch(setQuotationListParams({ customer_id: value }))}
              allowClear
            />
          </div>

          <div className="flex items-center justify-around gap-3">
            <Button
              type="primary"
              icon={<FaRegFileExcel size={14} />}
              className="bg-emerald-800 hover:!bg-emerald-700"
            // onClick={exportExcel}
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<FaRegFilePdf size={14} />}
              className="bg-rose-600 hover:!bg-rose-500"
            // onClick={exportPdf}
            >
              Print
            </Button>
          </div>
          {/* </div> */}
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                type: 'checkbox',
                selectedRowKeys: deleteIDs,
                onChange: (selectedRowKeys) => dispatch(setQuotationDeleteIDs(selectedRowKeys))
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          // rowKey="quotation_id"
          rowKey={(record) => record.quotation_id}
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} quotations`
          }}
          onChange={(page, _, sorting) => {
            sessionStorage.setItem('quotationLimit', page.pageSize);
            dispatch(
              setQuotationListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order
              })
            );
          }}
          // dataSource={list}
          dataSource={groupedQuotationData}
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
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these quotations?"
        description="After deleting, you will not be able to recover."
      />

      <ChargeOrderModal />
    </>
  );
};

export default QuotationReport;
