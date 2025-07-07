import { Button, Divider, Table } from 'antd';
import { useState } from 'react';
import GMSLogo from '../../../assets/logo-with-title.png';
import DebouncedCommaSeparatedInput from '../../../components/Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../../../components/Input/DebounceInput';
import { decodeRfqData } from '../../../utils/encode';
import api from '../../../axiosInstance';
import toast from 'react-hot-toast';

const getInitialState = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const qParam = queryParams.get('q');
  const rfqData = decodeRfqData(qParam);
  return rfqData || null;
};

const VendorPlatformQuotation = () => {
  const [data, setData] = useState(getInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateDetailValue = (index, key, value) => {
    const newQuotationDetail = [...data?.quotation_detail];
    newQuotationDetail[index][key] = value;

    setData({
      ...data,
      quotation_detail: newQuotationDetail,
    });
  };

  const onSubmit = async () => {
    try {
      if (!data) return;

      setIsSubmitting(true);
      const quotationId = data?.quotation?.quotation_id;
      const vendorId = data?.vendor?.supplier_id;

      await api.put(`/vendor-platform/quotation/vendor/${quotationId}`, {
        quotation_id: quotationId,
        vendor_id: vendorId,
        quotation_detail: data?.quotation_detail,
      });

      toast.success('Details updated successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 270,
      render: (_, record) =>
        record?.product_type_id == '4' ? record?.product_name : record?.product?.name,
    },
    {
      title: 'Rate',
      dataIndex: 'vendor_rate',
      key: 'vendor_rate',
      width: 120,
      render: (_, { vendor_rate }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={vendor_rate}
            onChange={(value) => updateDetailValue(index, 'vendor_rate', value)}
          />
        );
      },
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 120,
      render: (_, record) => record?.unit?.name,
    },
    {
      title: 'Vendor Part #',
      dataIndex: 'vendor_part_no',
      key: 'vendor_part_no',
      width: 120,
      render: (_, { vendor_part_no }, index) => {
        return (
          <DebounceInput
            value={vendor_part_no}
            onChange={(value) => updateDetailValue(index, 'vendor_part_no', value)}
          />
        );
      },
    },
    {
      title: 'Vendor Notes',
      dataIndex: 'vendor_notes',
      key: 'vendor_notes',
      width: 270,
      render: (_, { vendor_notes }, index) => {
        return (
          <DebounceInput
            value={vendor_notes}
            onChange={(value) => updateDetailValue(index, 'vendor_notes', value)}
          />
        );
      },
    },
  ];

  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center justify-center">
        <img src={GMSLogo} alt="GMS Logo" className="h-32 w-32" />
      </div>

      <div className="mt-4 rounded border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-16 gap-y-4">
          <div>
            <span className="mr-2 text-gray-600">Quotation No:</span>
            <span>{data?.quotation?.document_identity}</span>
          </div>
          <div>
            <span className="mr-2 text-gray-600">Event:</span>
            <span>{data?.quotation?.event?.event_code}</span>
          </div>
          <div>
            <span className="mr-2 text-gray-600">Vessel:</span>
            <span>{data?.quotation?.vessel?.name}</span>
          </div>
        </div>

        <Divider className="pb-2 pt-6">Items</Divider>

        <Table
          size="small"
          pagination={false}
          columns={columns}
          rowKey={'quotation_detail_id'}
          dataSource={data?.quotation_detail || []}
        />

        <div className="mt-4 flex justify-end">
          <Button type="primary" onClick={onSubmit} loading={isSubmitting}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorPlatformQuotation;
