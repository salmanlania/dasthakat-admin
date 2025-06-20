import { Breadcrumb, Button, DatePicker, Input, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import createQuotationReportPrint from '../../utils/Pdf/quotation-report-list.js';
import {
  bulkDeleteQuotation,
  deleteQuotation,
  getQuotationForPrint,
  getQuotationListReport,
  setQuotationDeleteIDs,
  setQuotationListParams,
  getQuotationListPrint
} from '../../store/features/quotationSlice';
import generateQuotationReportExcel from '../../utils/excel/quotation-report-excel.js';
import { createQuotationPrint } from '../../utils/prints/quotation-print';

import { FaRegFileExcel } from 'react-icons/fa6';
import { FaRegFilePdf } from 'react-icons/fa';

const QuotationReport = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, params, isBulkDeleting, deleteIDs } = useSelector(
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
      dispatch(getQuotationListReport(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuotation(deleteIDs)).unwrap();
      toast.success('Quotations deleted successfully');
      closeDeleteModal();
      await dispatch(getQuotationListReport(formattedParams)).unwrap();
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

  const columns = [
    {
      title: 'Quotation Date',
      dataIndex: 'document_date',
      key: 'document_date',
      sorter: true,
      width: 110,
      ellipsis: true
    },
    {
      title: 'Quotation No',
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 130,
      ellipsis: true
    },
    {
      title: 'Event Number',
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 140,
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
      title: 'T. Quantity',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      sorter: true,
      width: 120,
      ellipsis: true
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      sorter: true,
      width: 140,
      ellipsis: true
    },
    {
      title: 'Port',
      dataIndex: 'port_name',
      key: 'port_name',
      sorter: true,
      width: 150,
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      width: 100,
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

    // dispatch(getQuotationListReport(formattedParams)).unwrap().catch(handleError);

    // const savedLimit = sessionStorage.getItem('quotationLimit');
    // if (savedLimit && +savedLimit !== params.limit) {
    //   dispatch(setQuotationListParams({ limit: +savedLimit }));
    // }
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
    params.start_date,
    params.end_date,
    params.status,
    debouncedSearch,
    debouncedQuotationNo,
    debouncedCustomerRef
  ]);

  const filtersAreActive = useMemo(() => {
    return (
      params.search ||
      params.start_date ||
      params.end_date ||
      params.event_id ||
      params.document_identity ||
      params.vessel_id ||
      params.customer_id
    );
  }, [
    params.search,
    params.start_date,
    params.end_date,
    params.event_id,
    params.document_identity,
    params.vessel_id,
    params.customer_id
  ]);

  const exportPdf = async () => {

    if (!filtersAreActive) {
      // toast.error("Please select at least one filter before exporting.");
      return;
    }

    const loadingToast = toast.loading('Loading Print View...');
    const originalParams = { ...params };

    try {
      const startDate = params.start_date ? dayjs(params.start_date).format('YYYY-MM-DD') : null;
      const endDate = params.end_date ? dayjs(params.end_date).format('YYYY-MM-DD') : null;

      const exportParams = {
        ...params,
        limit: 1000000000000,
        start_date: startDate,
        end_date: endDate,
        sort_direction: 'ascend'
      };

      if (!startDate && !endDate) {
        delete exportParams.start_date;
        delete exportParams.end_date;
      }

      const data = await dispatch(getQuotationListPrint(exportParams)).unwrap();


      const filterDetails = {
        customer: params.customer_id?.label,
        event_label: params.event_label,
        customer_label: params.customer_label,
        vessel_label: params.vessel_label,
        vessel: params.vessel_id?.label,
        event: params.event_id?.label,
        quotationNo: params.document_identity,
        startDate,
        endDate,
        document_identity: params.document_identity
      };

      createQuotationReportPrint(Array.isArray(data) ? data : [data], true);

      dispatch(setQuotationListParams(originalParams));

    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const exportExcel = async () => {
    const loadingToast = toast.loading('Downloading Excel File...');

    const originalParams = { ...params };

    try {
      const startDate = params.start_date ? dayjs(params.start_date).format('YYYY-MM-DD') : null;
      const endDate = params.end_date ? dayjs(params.end_date).format('YYYY-MM-DD') : null;

      const exportParams = {
        ...params,
        limit: 1000000000000,
        start_date: startDate,
        end_date: endDate,
        sort_direction: 'ascend'
      };

      const data = await dispatch(getQuotationListPrint(exportParams)).unwrap();

      generateQuotationReportExcel(data, true);

      dispatch(setQuotationListParams(originalParams));
    } catch (error) {
      handleError(error)
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleClearFilters = () => {
    const clearedParams = {
      search: '',
      start_date: null,
      end_date: null,
      event_id: null,
      event_label: null,
      document_identity: '',
      vessel_id: null,
      vessel_label: null,
      customer_id: null,
      customer_label: null,
      page: 1
    };

    dispatch(setQuotationListParams(clearedParams));
    dispatch(getQuotationListReport(clearedParams)).unwrap().catch(handleError);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>QUOTATION REPORT</PageHeading>
        <Breadcrumb items={[{ title: 'Quotation Report' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
          <div className="min-w-[200px]">
            <Form.Item name="date_range" label="Date Range" layout="vertical">
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

                  if (!dates || !dates[0] || !dates[1]) {
                    newParams.start_date = null;
                    newParams.end_date = null;
                  }

                  const fetchParams = { ...params, ...newParams, page: 1 };

                  dispatch(setQuotationListParams(fetchParams));

                  if (!newParams.start_date && !newParams.end_date) {
                    dispatch(getQuotationListReport(fetchParams)).unwrap().catch(handleError);
                  }

                }}
                format="MM-DD-YYYY"
              />
            </Form.Item>
          </div>
          <div className="min-w-[200px]">
            <Form.Item name="event_id" label="Event" layout="vertical">
              <AsyncSelect
                endpoint="/event"
                className="w-full"
                valueKey="event_id"
                labelKey="event_code"
                placeholder="Select Event"
                labelInValue={true}
                value={params.event_id}
                onChange={(selected) => {
                  dispatch(setQuotationListParams({ event_id: selected?.value, event_label: selected?.label }))
                }}
                allowClear
              />
            </Form.Item>
          </div>

          <div className="min-w-[200px]">
            <Form.Item name="document_identity" label="Quotation No" layout="vertical">
              <Input
                placeholder="Enter Quotation No"
                allowClear
                value={params.document_identity}
                onChange={(e) =>
                  dispatch(setQuotationListParams({ document_identity: e.target.value }))
                }
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center mx-auto">
          <div className="min-w-[260px]">
            <Form.Item name="vessel_id" label="Vessel" layout="vertical">
              <AsyncSelect
                endpoint="/vessel"
                className="w-full"
                valueKey="vessel_id"
                labelInValue={true}
                labelKey="name"
                placeholder="Select Vessel"
                value={params.vessel_id}
                onChange={(selected) => {
                  dispatch(setQuotationListParams({ vessel_id: selected?.value, vessel_label: selected?.label }))
                }}
                allowClear
              />
            </Form.Item>
          </div>

          <div className="min-w-[240px]">
            <Form.Item name="customer_id" label="Customer" layout="vertical">
              <AsyncSelect
                endpoint="/customer"
                className="w-full"
                valueKey="customer_id"
                labelKey="name"
                placeholder="Select Customer"
                value={params.customer_id}
                labelInValue={true}
                onChange={(selected) => {
                  dispatch(setQuotationListParams({ customer_id: selected?.value, customer_label: selected?.label }))
                }}
                allowClear
              />
            </Form.Item>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={handleClearFilters}
              type="primary"
              // className="bg-sky-800 hover:!bg-sky-700 hover:text-white"
              className="bg-sky-800 hover:!bg-sky-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!filtersAreActive}
            >
              Clear Filters
            </Button>
            <Button
              type="primary"
              icon={<FaRegFileExcel size={14} />}
              className="bg-emerald-800 hover:!bg-emerald-700"
              disabled={!filtersAreActive}
              onClick={exportExcel}
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<FaRegFilePdf size={14} />}
              className="bg-rose-600 hover:!bg-rose-500"
              disabled={!filtersAreActive}
              onClick={exportPdf}
            >
              Print
            </Button>
          </div>
        </div>

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

export default QuotationReport;
