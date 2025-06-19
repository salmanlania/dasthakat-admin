import { Breadcrumb, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import useError from '../../hooks/useError';
import { getBidResponseList } from '../../store/features/quotationSlice';
import { createBidResponsePrint } from '../../utils/prints/bid-response-print';

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
    limit: 5000,
  });

  const handleExport = async (type) => {
    try {
      setIsSubmitting(type);
      const { data } = await dispatch(getBidResponseList(filterParams)).unwrap();
      console.log(data);
      createBidResponsePrint(data);
    } catch (error) {
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
            <div>
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
            </div>

            <div>
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
            </div>

            <div>
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
            </div>
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
