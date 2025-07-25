
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
  const handleError = useError();
  const { id } = useParams();

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
          // Modal.error({
          //   title: 'RFQ Expired',
          //   content: (
          //     <div style={{ fontSize: '18px', lineHeight: 1.6 }}>
          //       <p>This RFQ was required by <strong>{requiredDate.format('YYYY-MM-DD')}</strong>.</p>
          //       <p>You can no longer submit a quotation for this request.</p>
          //     </div>
          //   ),
          //   width: 800,
          //   style: {
          //     top: 50,
          //     padding: 30,
          //   },
          //   maskClosable: false,
          //   keyboard: false,
          //   footer: null,
          // })
          Swal.fire({
            title: '<strong>RFQ Expired</strong>',
            html: `
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
        setData({
          ...fetchedData,
          quotation_detail: vendorQuotationDetails,
        });
      } catch (error) {
        handleError(error);
      } finally {
        setCheckingExpiry(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sourceData = (data?.details || []).map((item) => {
    return item?.vendor_quotation_detail || {};
  });

  const updateDetailValue = (index, key, value) => {
    const newQuotationDetail = [...sourceData];
    newQuotationDetail[index][key] = value;

    console.log('newQuotationDetail', newQuotationDetail);

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

      const quotationDetail = data?.quotation_detail || sourceData;

      if (!quotationDetail || quotationDetail.length === 0) {
        toast.error('No quotation details to submit.');
        return;
      }
      await api.put(`/vendor-platform/quotation/vendor/${id}`, {
        quotation_id: quotationId,
        vendor_id: vendorId,
        quotation_detail: quotationDetail,
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
      render: (_, record) =>
        record?.quotation_detail?.unit?.name ? record?.quotation_detail?.unit?.name : null,
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

  if (checkingExpiry) return null;
  if (isExpired) return null;
  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center justify-center">
        <img src={GMSLogo} alt="GMS Logo" className="h-32 w-32" />
      </div>

      <div className="mt-4 rounded border border-gray-200 p-4 shadow-sm">
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
          <div>
            <span className="mr-2 text-gray-600">Document ID:</span>
            <span>{data?.document_identity ? data?.document_identity : null}</span>
          </div>
        </div>

        <Divider className="pb-2 pt-6">Items</Divider>

        <Table
          size="small"
          pagination={false}
          columns={columns}
          rowKey={'quotation_detail_id'}
          dataSource={sourceData || []}
          loading={loading}
          summary={(pageData) => {
            let totalQuantity = 0;

            pageData.forEach((item) => {
              const qty = Number(item?.quotation_detail?.quantity);
              if (!isNaN(qty)) totalQuantity += qty;
            });

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>{totalQuantity}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} />
              </Table.Summary.Row>
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
