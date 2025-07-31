import { Modal, Table, Input, Spin, Radio, Button, Switch, DatePicker, Form } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVendor } from '../../store/features/quotationSlice';
import AsyncSelect from '../AsyncSelect';
import { postVendorSelection } from '../../store/features/quotationSlice';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import useError from '../../hooks/useError';

const VendorSelectionModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const handleError = useError();

  const {
    initialFormValues,
    vendorQuotationDetails,
    permissions,
    vendorDetails,
    isItemVendorLoading
  } = useSelector((state) => state.quotation);

  const id = initialFormValues?.quotation_id;

  const [data, setData] = useState([]);
  const [vendorCount] = useState(4);
  const [isSaving, setIsSaving] = useState(false);
  const [isExitSaving, setIsExitSaving] = useState(false);
  const [form] = Form.useForm();
  const hasFetchedVendors = useRef(false);
  const lastFetchedId = useRef(null);

  useEffect(() => {
    if (!id || !open) {
      hasFetchedVendors.current = false;
      lastFetchedId.current = null;
      return;
    }

    if (hasFetchedVendors.current && lastFetchedId.current === id) {
      return;
    }

    const fetchVendors = async () => {
      try {
        hasFetchedVendors.current = true;
        lastFetchedId.current = id;
        await dispatch(getVendor(id)).unwrap();
      } catch (err) {
        handleError(err);
      }
    };

    fetchVendors();

    if (open) {
      const tomorrow = dayjs().add(1, 'day');
      form.setFieldValue('required_date', tomorrow);
    }

  }, [id, open, dispatch, handleError, form]);

  useEffect(() => {
    if (!vendorQuotationDetails?.length) {
      setData([]);
      return;
    }

    const mappedData = vendorQuotationDetails
      .filter((item) => [3, 4].includes(item?.product_type_id?.value))
      .map((item, index) => {
        const existingVendors = vendorDetails?.filter(
          (vendor) => vendor.quotation_detail_id === item.quotation_detail_id
        ) || [];

        const vendors = Array.from({ length: vendorCount }, (_, vendorIndex) => {
          const existingVendor = existingVendors[vendorIndex] || null;

          if (vendorIndex === 0 && !existingVendor && existingVendors.length === 0) {
            return {
              name: `Vendor`,
              rate: item.rate || 0,
              isPrimary: true,
              supplier_id: item.supplier_id ? {
                value: item.supplier_id.value,
                label: item.supplier_id.label
              } : null,
              rfqSent: false,
              vendor_part_no: item.vendor_part_no || '',
            };
          }
          return existingVendor
            ? {
              name: `Vendor`,
              rate: existingVendor.vendor_rate || 0,
              isPrimary: existingVendor.is_primary_vendor === 1,
              supplier_id: existingVendor.vendor
                ? { value: existingVendor.vendor.supplier_id, label: existingVendor.vendor.name }
                : null,
              rfqSent: existingVendor.rfq === 1,
              vendor_part_no: existingVendor.vendor_part_no || '',
              vendor_quotation_detail_id: existingVendor.vendor_quotation_detail_id || null,
            }
            : {
              name: `Vendor`,
              rate: 0,
              isPrimary: vendorIndex === 0,
              supplier_id: null,
              rfqSent: false,
            };
        });

        vendors.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

        return {
          key: item.quotation_detail_id || String(index + 1),
          quotation_detail_id: item.quotation_detail_id,
          vendor_quotation_detail_id: item.vendor_quotation_detail_id,
          product_name:
            item.product_type_id?.value === 4
              ? item.product_name
              : item.product_id?.label || item.product_name || 'Unnamed Product',
          product_type_id: item.product_type_id,
          quantity: item.quantity,
          index,
          vendors,
        };
      });

    setData(mappedData);
  }, [vendorQuotationDetails, vendorDetails, vendorCount]);

  const toggleRfq = (productIndex, vendorIndex, checked) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[productIndex].vendors[vendorIndex].rfqSent = checked;
    setData(newData);
  };

  const onFinish = async (value) => {
    const requiredDateValue = form.getFieldValue('required_date');
    const invalidRows = data.filter((product) =>
      product.vendors.some((vendor) => vendor.isPrimary && !vendor.supplier_id)
    );
    if (invalidRows.length > 0) {
      toast.error('Primary vendors must have a selected supplier.');
      return;
    }

    const anyRfqSelected = data.some(product =>
      product.vendors.some(vendor => vendor.rfqSent)
    );

    if (anyRfqSelected && !requiredDateValue) {
      toast.error('Please select a required date.');
      return;
    }

    const formattedDate = requiredDateValue
      ? dayjs(requiredDateValue).format('YYYY-MM-DD')
      : null;

    if (value === 'saveExit') {
      setIsExitSaving(true);
    } else {
      setIsSaving(true);
    }

    const payload = {
      quotation_id: initialFormValues?.quotation_id,
      quotation_detail: [],
      date_required: formattedDate
    };

    data.forEach((product) => {
      const quotation_detail_id = product.quotation_detail_id;

      product.vendors.forEach((vendor) => {
        const supplier = vendor?.supplier_id?.value || null;

        payload.quotation_detail.push({
          vendor_id: supplier,
          quotation_detail_id,
          vendor_rate: vendor.rate ? parseFloat(vendor.rate) : null,
          is_primary_vendor: vendor.isPrimary ? 1 : 0,
          rfq: vendor.rfqSent ? 1 : 0,
          vendor_part_no: vendor.vendor_part_no || '',
          vendor_quotation_detail_id: vendor.vendor_quotation_detail_id || '',
        });
      });
    });
    try {
      await dispatch(postVendorSelection(payload)).unwrap();
      toast.success('Quotation Vendors Saved Successfully!');
      if (value === 'saveExit') {
        onClose();
      } else {
        if (id) {
          try {
            await dispatch(getVendor(id)).unwrap();
          } catch (err) {
            handleError(err);
          }
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      if (value === 'saveExit') {
        setIsExitSaving(false);
      } else {
        setIsSaving(false);
      }
    }
  };

  const handleRateChange = (productIndex, vendorIndex, value) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[productIndex].vendors[vendorIndex].rate = value;
    setData(newData);
  };

  const handlePrimaryChange = (productIndex, vendorIndex) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[productIndex].vendors.forEach((vendor, idx) => {
      vendor.isPrimary = idx === vendorIndex;
    });
    newData[productIndex].vendors.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    setData(newData);
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      fixed: 'left',
      width: 140,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
    },
    ...Array.from({ length: vendorCount }).flatMap((_, vendorIndex) => [
      {
        title: `PRM`,
        key: `vendor_primary_${vendorIndex}`,
        width: 70,
        ellipsis: true,
        render: (_, record, productIndex) => (
          <Radio
            checked={record.vendors[vendorIndex].isPrimary}
            onChange={() => handlePrimaryChange(productIndex, vendorIndex)}
          />
        ),
      },
      {
        title: `Vendor`,
        key: `supplier_id-${vendorIndex}`,
        width: 280,
        ellipsis: false,
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          return (
            <div className='flex ' style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: 330 }}>
              <AsyncSelect
                endpoint="/supplier"
                valueKey="supplier_id"
                labelKey="name"
                labelInValue
                style={{ width: '100%', minWidth: 200 }}
                className="w-full"
                disabled={record.product_type_id?.value === 1 || record.product_type_id?.value === 2}
                value={vendor?.supplier_id}
                onChange={(selected) => {
                  const updatedData = [...data];
                  const updatedVendors = [...updatedData[productIndex].vendors];
                  const updatedVendor = {
                    ...updatedVendors[vendorIndex],
                    supplier_id: selected,
                  };
                  updatedVendors[vendorIndex] = updatedVendor;
                  updatedData[productIndex] = {
                    ...updatedData[productIndex],
                    vendors: updatedVendors,
                  };
                  setData(updatedData);
                }}
                addNewLink={permissions?.supplier?.add ? '/vendor/create' : null}
              />
            </div>
          );
        },
      },
      {
        title: `Cost`,
        key: `rate-${vendorIndex}`,
        width: 120,
        maxWidth: 100,
        ellipsis: true,
        render: (_, record, productIndex) => (
          <Input
            value={record.vendors[vendorIndex].rate}
            onChange={(e) => handleRateChange(productIndex, vendorIndex, e.target.value)}
            placeholder="Rate"
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: `RFQ`,
        key: `vendor_rfq_${vendorIndex}`,
        width: 80,
        ellipsis: true,
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          return (
            <Switch
              checked={vendor.rfqSent}
              onChange={(checked) => toggleRfq(productIndex, vendorIndex, checked)}
            />
          );
        },
      },
    ]),
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Select Vendors</span>
          <Form form={form}>
            <Form.Item
              name="required_date"
              rules={[{ required: true, message: 'Please select a date' }]}
              style={{ marginBottom: 0 }}
              label="Quote Required Date"
            >
              <DatePicker
                format="MM-DD-YYYY"
                placeholder="Select Date"
                style={{ marginLeft: 16 }}
              />
            </Form.Item>
          </Form>
        </div>
      }
      width="95%"
    >
      <Spin spinning={isItemVendorLoading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 'calc(100% - 200px)', y: 400 }}
          summary={(pageData) => {
            if (pageData.length === 0) return null;
            let totalQuantity = 0;

            pageData.forEach((item) => {
              const qty = Number(item?.quantity);
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
      </Spin>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Exit</Button>
        <Button className="w-28" type="primary" onClick={() => onFinish()} loading={isSaving}>
          Save
        </Button>
        <Button className="w-28 bg-green-600 hover:!bg-green-500" type="primary" onClick={() => onFinish('saveExit')} loading={isExitSaving}>
          Save & Exit
        </Button>
      </div>
    </Modal>
  );
};

export default VendorSelectionModal;