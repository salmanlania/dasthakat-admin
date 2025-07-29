
import { Button, Divider, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import GMSLogo from '../../../assets/logo-with-title.png';
import api from '../../../axiosInstance';
import DebouncedCommaSeparatedInput from '../../../components/Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../../../components/Input/DebounceInput';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';

const VendorPlatformQuotation = () => {
  useDocumentTitle('Vendor Platform Quotation');
  const [data, setData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [checkingExpiry, setCheckingExpiry] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vendorReferenceNo, setVendorReferenceNo] = useState('');
  const [vendorRemarks, setVendorRemarks] = useState('');
  const handleError = useError();
  const { id } = useParams();

  useEffect(() => {
    console.log('state', {
      vendorReferenceNo,
      vendorRemarks
    })
    const style = document.createElement('style');
    style.innerHTML = `
    .ant-table-thead > tr > th {
      background-color: #003366 !important;
      color: #ffffff !important;
      font-weight: 600;
      font-size: 13px;
    }
    .ant-table-tbody > tr:nth-child(even) > td {
      background-color: #f9fcff !important;
    }
    .ant-table-tbody > tr:nth-child(odd) > td {
      background-color: #eef3f9 !important;
    }
    .ant-table-tbody > tr:hover > td {
      background-color: #d6e4ff !important;
    }
  `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/vendor-platform/quotation/rfq/${id}`);
        const fetchedData = res?.data?.data;

        const todayDate = dayjs()
        // const requiredDate = dayjs(fetchedData?.date_required);
        const requiredDate = dayjs(fetchedData?.date_required).startOf('day');


        if (requiredDate.isBefore(todayDate)) {
          setIsExpired(true);
          Swal.fire({
            title: '<strong>RFQ Expired</strong>',
            html:
              `
                <div style="font-size: 18px; line-height: 1.8;">
                  <p>This RFQ was required by <strong>${requiredDate.format('YYYY-MM-DD')}</strong>.</p>
                  <p>You can no longer submit a quotation for this request.</p>
                </div>
              `,
            width: '700px',
            padding: '2em',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            backdrop: `
    rgba(0, 0, 0, 0.4)
  `,
          });
          return
        }
        const vendorQuotationDetails = fetchedData?.details?.map((item) => item?.vendor_quotation_detail || {});
        // setData({
        //   ...fetchedData,
        //   quotation_detail: vendorQuotationDetails,
        // });
        setData(fetchedData);

        setVendorReferenceNo(fetchedData?.vendor_ref_no || '');
        setVendorRemarks(fetchedData?.vendor_remarks || '');

      } catch (error) {
        handleError(error);
      } finally {
        setCheckingExpiry(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const sourceData = (data?.details || []).map((item) => {
  //   return item?.vendor_quotation_detail || {};
  // });

  const sourceData = (data?.details || []).map((item) => ({
    ...item?.vendor_quotation_detail,
    quotation_detail: item?.quotation_detail, // needed for product name & unit
  }));

  // const updateDetailValue = (index, key, value) => {
  //   const newQuotationDetail = [...sourceData];
  //   newQuotationDetail[index][key] = value;

  //   setData({
  //     ...data,
  //     quotation_detail: newQuotationDetail,
  //   });
  // };

  const updateDetailValue = (index, key, value) => {
    const updatedDetails = [...data.details];
    const detail = updatedDetails[index];

    if (!detail.vendor_quotation_detail) {
      detail.vendor_quotation_detail = {};
    }

    detail.vendor_quotation_detail[key] = value;

    setData({
      ...data,
      details: updatedDetails,
    });
  };

  const onSubmit = async () => {
    try {
      if (!data) return;

      setIsSubmitting(true);
      const quotationId = data?.quotation?.quotation_id;
      const vendorId = data?.vendor?.supplier_id;

      // const quotationDetail = data?.quotation_detail || sourceData;
      const quotationDetail = data?.details?.map(d => d.vendor_quotation_detail) || [];

      if (!quotationDetail || quotationDetail.length === 0) {
        toast.error('No quotation details to submit.');
        return;
      }
      await api.put(`/vendor-platform/quotation/vendor/${id}`, {
        quotation_id: quotationId,
        vendor_id: vendorId,
        vendor_ref_no: vendorReferenceNo,
        vendor_remarks: vendorRemarks,
        quotation_detail: quotationDetail,
      });

      toast.success('Details updated successfully');

      const res = await api.get(`/vendor-platform/quotation/rfq/${id}`);
      const fetchedData = res?.data?.data;
      const vendorQuotationDetails = fetchedData?.details?.map((item) => item?.vendor_quotation_detail || {});

      // setData({
      //   ...fetchedData,
      //   quotation_detail: vendorQuotationDetails,
      // });
      setData(fetchedData);
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
        record?.quotation_detail?.product_type_id == '4'
          ? record?.quotation_detail?.product_name
          : record?.quotation_detail?.product?.name,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (_, record) =>
        record?.quotation_detail?.quantity ? record?.quotation_detail?.quantity : null,
    },
    {
      title: 'Price',
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
      render: (_, record) =>
        record?.quotation_detail?.unit?.name ? record?.quotation_detail?.unit?.name : null,
    },
    {
      title: 'Vendor Part #',
      dataIndex: 'vendor_part_no',
      key: 'vendor_part_no',
      width: 120,
      render: (_, record, index) => {
        return (
          <DebounceInput
            value={record?.vendor_part_no ? record?.vendor_part_no : ''}
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
      render: (_, record, index) => {
        console.log('record', record)
        return (
          <DebounceInput
            value={record?.vendor_notes ? record?.vendor_notes : ''}
            onChange={(value) => updateDetailValue(index, 'vendor_notes', value)}
          />
        );
      },
    },
  ];

  if (checkingExpiry) return null;
  if (isExpired) return null;
  return (
    // <div className="p-6 md:p-12">
    <div style={{ padding: '24px', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <div className="flex items-center justify-center">
        <img src={GMSLogo} alt="GMS Logo" className="h-32 w-32" />
      </div>

      {/* <div className="mt-4 rounded border border-gray-200 p-4 shadow-sm"> */}
      <div
        style={{
          marginTop: '24px',
          padding: '24px',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* <div className='flex flex-col justify-center items-center gap-4'>
          <div className="flex flex-wrap items-center gap-x-16 gap-y-4">
            <div>
              <span className="mr-2 text-gray-600">Quotation No:</span>
              <span>{data?.quotation ? data?.quotation?.document_identity : null}</span>
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
          <div className="flex flex-wrap items-center gap-x-16 gap-y-4">
            <div>
              <span className="mr-2 text-gray-600">Document ID:</span>
              <span>{data?.document_identity ? data?.document_identity : null}</span>
            </div>
            <div>
              <span className="mr-2 text-gray-600">Vendor Refrence No:</span>
              <input style={{ border: '1px solid' }} className='p-1' value={data?.document_identity ? data?.document_identity : null} />
            </div>
            <div>
              <span className="mr-2 text-gray-600">Vendor Remarks:</span>
              <input style={{ border: '1px solid' }} className='p-1' value={data?.document_identity ? data?.document_identity : null} />
            </div>
          </div>
        </div> */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '24px',
            padding: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          {/* First Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <div style={{ minWidth: '200px' }}>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Quotation No:</span>
              <span style={{ fontWeight: 600 }}>{data?.quotation?.document_identity || '-'}</span>
            </div>
            <div style={{ minWidth: '200px' }}>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Event:</span>
              <span style={{ fontWeight: 600 }}>{data?.quotation?.event?.event_code || '-'}</span>
            </div>
            <div style={{ minWidth: '200px' }}>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Vessel:</span>
              <span style={{ fontWeight: 600 }}>{data?.quotation?.vessel?.name || '-'}</span>
            </div>
          </div>

          {/* Second Row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <div style={{ minWidth: '200px' }}>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Document ID:</span>
              <span style={{ fontWeight: 600 }}>{data?.document_identity || '-'}</span>
            </div>
            <div style={{ minWidth: '250px' }}>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Vendor Reference No:</span>
              <DebounceInput
                value={vendorReferenceNo}
                onChange={(value) => setVendorReferenceNo(value)}
                placeholder="Enter Vendor Reference No"
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  width: '100%',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ minWidth: '250px' }}>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Vendor Remarks:</span>
              <DebounceInput
                value={vendorRemarks}
                onChange={(value) => setVendorRemarks(value)}
                placeholder="Enter Vendor Remarks"
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  width: '100%',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* <Divider className="pb-2 pt-6">Items</Divider> */}
        <Divider style={{ borderColor: '#d0d7e2', color: '#1f3a93', fontWeight: '600' }}>Items</Divider>

        <Table
          size="small"
          pagination={false}
          columns={columns}
          rowKey={'quotation_detail_id'}
          dataSource={sourceData || []}
          loading={loading}
          summary={(pageData) => {
            if (pageData.length === 0) return null;
            let totalQuantity = 0;
            let totalPrice = 0;
            let totalAmount = 0

            pageData.forEach((item) => {
              const qty = Number(item?.quotation_detail?.quantity);
              const price = Number(item?.vendor_rate?.toString()?.replace(/,/g, '')) || 0;
              const totalCal = qty * price
              if (!isNaN(qty)) totalQuantity += qty;
              if (!isNaN(price)) totalPrice += price;
              if (!isNaN(price)) totalAmount += totalCal;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong>{totalQuantity}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2}><strong>{totalPrice}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={3} />
                  <Table.Summary.Cell index={4} />
                  <Table.Summary.Cell index={5} />
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>Total Amount</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong>{totalAmount}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3} />
                  <Table.Summary.Cell index={4} />
                  <Table.Summary.Cell index={5} />
                </Table.Summary.Row>
              </>
            );
          }}
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
