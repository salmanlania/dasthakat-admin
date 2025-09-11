import { Button, DatePicker, Divider, Modal, Table } from 'antd';
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

const VendorPlatformChargeOrder = () => {
  useDocumentTitle('Vendor Platform Charge Order');
  const [data, setData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [checkingExpiry, setCheckingExpiry] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vendorReferenceNo, setVendorReferenceNo] = useState('');
  const [vendorRemarks, setVendorRemarks] = useState('');
  const [validityDate, setValidityDate] = useState(dayjs().add(1, 'month'));
  const handleError = useError();
  const { id } = useParams();

  const [totals, setTotals] = useState({
    totalQuantity: 0,
    totalPrice: 0,
    totalAmount: 0
  });

  const calculateTotals = (details) => {
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalAmount = 0;

    details
      ?.filter((item) => !item.is_deleted)
      .forEach((item) => {
        const itemQty = Number(item?.vendor_charge_order_detail ? item?.vendor_charge_order_detail?.charge_order_detail?.quantity : item?.quantity ? item?.quantity : 0)
        const itemPrice = Number(item.vendor_rate?.toString()?.replace(/,/g, '')) || 0;
        const itemTotal = itemQty * itemPrice;

        totalQuantity += itemQty;
        totalPrice += itemPrice;
        totalAmount += itemTotal;
      });

    return {
      totalQuantity,
      totalPrice,
      totalAmount,
    };
  };

  useEffect(() => {
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

    .deleted-row {
      opacity: 0.5;
      pointer-events: all !important;
      background-color: #f5f5f5 !important;
      cursor: not-allowed !important;
    }
    
    .deleted-row:hover > td {
      background-color: #f5f5f5 !important;
      cursor: not-allowed !important;
    }
    
    .deleted-row td {
      color: #999 !important;
      cursor: not-allowed !important;
      user-select: none !important;
    }

    .deleted-row td * {
      pointer-events: none !important;
      cursor: not-allowed !important;
    }

    .deleted-row input,
    .deleted-row button,
    .deleted-row select,
    .deleted-row textarea {
      pointer-events: none !important;
      cursor: not-allowed !important;
      background-color: #f5f5f5 !important;
      color: #999 !important;
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
        const res = await api.get(`/vendor-platform/charge-order/rfq/${id}`);
        const fetchedData = res?.data?.data;

        const todayDate = dayjs()
        const requiredDate = dayjs(fetchedData?.date_required).startOf('day');


        if (requiredDate.isBefore(todayDate)) {
          setIsExpired(true);
          Swal.fire({
            title: '<strong>RFQ Expired</strong>',
            html:
              `
                <div style="font-size: 18px; line-height: 1.8;">
                  <p>This RFQ was required by <strong>${requiredDate.format('YYYY-MM-DD')}</strong>.</p>
                  <p>You can no longer submit a charge order for this request.</p>
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
        setData(fetchedData);

        setVendorReferenceNo(fetchedData?.vendor_ref_no || '');
        setVendorRemarks(fetchedData?.vendor_remarks || '');
        setValidityDate(dayjs(fetchedData?.validity_date || dayjs().add(1, 'month')));
        const initialTotals = calculateTotals(fetchedData?.details || []);
        setTotals(initialTotals);

      } catch (error) {
        handleError(error);
      } finally {
        setCheckingExpiry(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sourceData = (data?.details || []).map((item, index) => {
    return {
      ...item,
      product_name: item.product_name,
      quantity: item.quantity,
      unit: item.unit,
      product_type_id: item.product_type_id,
      vendor_rate: item.vendor_rate,
      uom: item?.unit?.name,
      product: item.product,
      detail_id: item.detail_id,
      is_deleted: item.is_deleted
    };
  });

  const updateDetailValue = (index, key, value) => {
    const updatedDetails = [...data.details];
    const detail = updatedDetails[index];

    if (!detail.vendor_charge_order_detail) {
      detail.vendor_charge_order_detail = {};
    }

    detail.vendor_charge_order_detail[key] = value;

    if (key === 'vendor_rate') {
      const qty = Number(detail?.quantity) || 0;
      const price = Number(value?.toString()?.replace(/,/g, '')) || 0;
      detail.vendor_charge_order_detail.total_amount = qty * price;
      detail.vendor_rate = price;

      const updatedTotals = calculateTotals(updatedDetails);
      setTotals(updatedTotals);
    }

    setData({
      ...data,
      details: updatedDetails,
    });
  };

  const onSubmit = async () => {
    try {
      if (!data) return;

      setIsSubmitting(true);
      const chargeOrderId = data?.charge_order?.charge_order_id;
      const vendorId = data?.vendor?.supplier_id;

      const chargeOrderDetail = data?.details
        ?.filter(d => !d.is_deleted)
        ?.map(d => ({
          ...d.vendor_charge_order_detail,
          detail_id: d.detail_id
        })) || [];

      if (!chargeOrderDetail || chargeOrderDetail.length === 0) {
        toast.error('No charge order details to submit.');
        return;
      }
      await api.put(`/vendor-platform/charge-order/vendor/${id}`, {
        charge_order_id: chargeOrderId,
        vendor_id: vendorId,
        vendor_ref_no: vendorReferenceNo,
        vendor_remarks: vendorRemarks,
        validity_date: validityDate.format('YYYY-MM-DD'),
        charge_order_detail: chargeOrderDetail,
      });

      toast.success('Details updated successfully');

      const res = await api.get(`/vendor-platform/charge-order/rfq/${id}`);
      const fetchedData = res?.data?.data;
      setData(fetchedData);

      const updatedTotals = calculateTotals(fetchedData?.details || []);
      setTotals(updatedTotals);

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
      render: (_, record) => {
        return (
          record?.is_deleted ? record?.product_name :
            record?.vendor_charge_order_detail?.charge_order_detail?.product_type_id == '4'
              ? record?.vendor_charge_order_detail?.charge_order_detail?.product_name
              : record?.vendor_charge_order_detail?.charge_order_detail?.product?.name
        );
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (_, record) =>
        record?.is_deleted ? record?.quantity : record?.vendor_charge_order_detail?.charge_order_detail?.quantity ? record?.vendor_charge_order_detail?.charge_order_detail?.quantity : null,
    },
    {
      title: 'Price',
      dataIndex: 'vendor_rate',
      key: 'vendor_rate',
      width: 120,
      render: (_, record, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={record?.vendor_rate}
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
      render: (_, record) => {
        return record?.is_deleted ? record?.unit?.name : record?.vendor_charge_order_detail?.charge_order_detail?.unit?.name ? record?.vendor_charge_order_detail?.charge_order_detail?.unit?.name : null;
      }
    },
    {
      title: 'Vendor Part #',
      dataIndex: 'vendor_part_no',
      key: 'vendor_part_no',
      width: 120,
      render: (_, record, index) => {
        return (
          <DebounceInput
            value={record?.is_deleted ? record?.vendor_part_no : record?.vendor_charge_order_detail?.vendor_part_no ? record?.vendor_charge_order_detail?.vendor_part_no : record?.vendor_charge_order_detail?.charge_order_detail?.vendor_part_no ? record?.vendor_charge_order_detail?.charge_order_detail?.vendor_part_no : ''}
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
        return (
          <DebounceInput
            value={record?.is_deleted ? record?.vendor_notes : record?.vendor_charge_order_detail?.vendor_notes ? record?.vendor_charge_order_detail?.vendor_notes : record?.vendor_charge_order_detail?.charge_order_detail?.vendor_notes ? record?.vendor_charge_order_detail?.charge_order_detail?.vendor_notes : ''}
            onChange={(value) => updateDetailValue(index, 'vendor_notes', value)}
          />
        );
      },
    },
  ];

  if (checkingExpiry) return null;
  if (isExpired) return null;
  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <div className="flex items-center justify-center">
        <img src={GMSLogo} alt="GMS Logo" className="h-32 w-32" />
      </div>

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
          <div className='w-full flex-col md:flex-row !items-start md:items-center !gap-5 md:!gap-[50px]'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '50px',
            }}
          >
            <div >
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Document ID:</span>
              <span style={{ fontWeight: 600 }}>{data?.document_identity || '-'}</span>
            </div>
            <div>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Charge Order No:</span>
              <span style={{ fontWeight: 600 }}>{data?.charge_order?.document_identity || '-'}</span>
            </div>
            <div>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Event:</span>
              <span style={{ fontWeight: 600 }}>{data?.charge_order?.event?.event_code || '-'}</span>
            </div>
            <div>
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Vessel:</span>
              <span style={{ fontWeight: 600 }}>{data?.charge_order?.vessel?.name || '-'}</span>
            </div>
          </div>
          <div className='grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4 gap-4'>

            <div >
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
            <div >
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
            <div >
              <span style={{ marginRight: '8px', color: '#555', fontWeight: 500 }}>Validity Date:</span>
              <DatePicker
                value={validityDate}
                onChange={(value) => setValidityDate(value)}
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

        <Divider style={{ borderColor: '#d0d7e2', color: '#1f3a93', fontWeight: '600' }}>Items</Divider>

        <Table
          size="small"
          pagination={false}
          columns={columns}
          rowKey={'charge_order_detail_id'}
          dataSource={sourceData || []}
          loading={loading}
          rowClassName={(record) => record.is_deleted ? 'deleted-row' : ''}
          summary={() => {
            if (!data?.details?.length) {
              return null;
            }
            const newCal = totals.totalQuantity * totals.totalPrice
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong>{totals.totalQuantity}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3} />
                  <Table.Summary.Cell index={4} />
                  <Table.Summary.Cell index={5} />
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>Total Amount</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1}><strong>{newCal}</strong></Table.Summary.Cell>
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

export default VendorPlatformChargeOrder;