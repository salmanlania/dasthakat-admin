import { Breadcrumb, Button, DatePicker, Form, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getBidResponseList } from '../../store/features/quotationSlice';
import { createBidResponsePrint } from '../../utils/prints/bid-response-print';
import { createGroupByBidResponsePrint } from '../../utils/prints/bid-response-print-groupby';

const { RangePicker } = DatePicker;

const BidResponseReport = () => {
  const dispatch = useDispatch();
  const handlerError = useError();
  const [isSubmitting, setIsSubmitting] = useState(null);

  const [filterParams, setFilterParams] = useState({
    start_date: null,
    end_date: null,
    vessel_id: null,
    customer_id: null,
    groupBy: null,
    limit: 5000,
  });

  const handleExport = async (type) => {
    try {
      setIsSubmitting(type);
      const { data } = await dispatch(getBidResponseList(filterParams)).unwrap();

      // Check if groupBy filter is applied
      if (filterParams.groupBy) {
        // Define mapping functions for different grouping criteria
        const groupByMapping = {
          date: (item) => dayjs(item.created_at).format('YYYY-MM-DD'), // Group by formatted date
          event: (item) => item.event_id, // Group by event ID
          customer: (item) => item.customer_id, // Group by customer ID
          vessel: (item) => item.vessel_id, // Group by vessel ID
        };

        // Get the appropriate grouping function based on selected criteria
        const groupKey = groupByMapping[filterParams.groupBy];
        if (!groupKey) return;

        // Group the data using reduce
        const groupByData = data.reduce((acc, item) => {
          const key = groupKey(item); // Get grouping key for current item
          if (!acc[key]) {
            acc[key] = []; // Initialize array for new group
          }
          acc[key].push(item); // Add item to its group
          return acc;
        }, {});

        // Create print with grouped data
        createGroupByBidResponsePrint(data, groupByData, filterParams.groupBy);
        return;
      }

      createBidResponsePrint(data);
    } catch (error) {
      console.log(error);
      handlerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>BID RESPONSE REPORT</PageHeading>
        <Breadcrumb items={[{ title: 'Bid Response Report' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Item name="date_range" label="Date Range" layout="vertical">
              <RangePicker
                value={[
                  filterParams.start_date ? dayjs(filterParams.start_date, 'YYYY-MM-DD') : null,
                  filterParams.end_date ? dayjs(filterParams.end_date, 'YYYY-MM-DD') : null,
                ]}
                onChange={(dates) => {
                  const newParams = { ...filterParams };

                  if (dates?.length) {
                    newParams.start_date = dates[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : null;
                    newParams.end_date = dates[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : null;
                  } else {
                    newParams.start_date = null;
                    newParams.end_date = null;
                  }
                  setFilterParams(newParams);
                }}
                format="MM-DD-YYYY"
                className="w-full"
              />
            </Form.Item>

            <Form.Item name="vessel" label="Vessel" layout="vertical">
              <AsyncSelect
                endpoint="/vessel"
                className="w-full"
                valueKey="vessel_id"
                labelKey="name"
                placeholder="Select Vessel"
                value={filterParams.vessel_id}
                onChange={(value) => setFilterParams({ ...filterParams, vessel_id: value })}
                allowClear
              />
            </Form.Item>

            <Form.Item name="customer" label="Customer" layout="vertical">
              <AsyncSelect
                endpoint="/customer"
                className="w-full"
                valueKey="customer_id"
                labelKey="name"
                placeholder="Select Customer"
                value={filterParams.customer_id}
                onChange={(value) => setFilterParams({ ...filterParams, customer_id: value })}
                allowClear
              />
            </Form.Item>

            <Form.Item name="groupBy" label="Group By" layout="vertical">
              <Select
                options={[
                  {
                    value: 'vessel',
                    label: 'Vessel',
                  },
                  {
                    value: 'customer',
                    label: 'Customer',
                  },
                  {
                    value: 'date',
                    label: 'Date',
                  },
                  {
                    value: 'event',
                    label: 'Event',
                  },
                ]}
                value={filterParams.groupBy}
                onChange={(value) => setFilterParams({ ...filterParams, groupBy: value })}
                allowClear
                placeholder="Select Group By"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="primary"
              loading={isSubmitting === 'excel'}
              onClick={() => handleExport('excel')}
              disabled={!filterParams.start_date || !filterParams.end_date}
              className="transition-opacity hover:opacity-80 disabled:!bg-gray-300 disabled:!opacity-100"
              style={{ backgroundColor: '#4CAF50' }}>
              Export to Excel
            </Button>
            <Button
              type="primary"
              loading={isSubmitting === 'pdf'}
              onClick={() => handleExport('pdf')}
              disabled={!filterParams.start_date || !filterParams.end_date}
              className="transition-opacity hover:opacity-80 disabled:!bg-gray-300 disabled:!opacity-100"
              style={{ backgroundColor: '#F44336' }}>
              Export to PDF
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BidResponseReport;
