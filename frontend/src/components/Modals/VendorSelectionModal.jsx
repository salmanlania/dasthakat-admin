import { Modal, Table, Input, Spin, Radio, Button, Switch } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVendor } from '../../store/features/quotationSlice';
import AsyncSelect from '../AsyncSelect';
import { postVendorSelection } from '../../store/features/quotationSlice';
import toast from 'react-hot-toast';
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
  const [vendorCount] = useState(4); // Fixed to 4 as per your original code
  const [isSaving, setIsSaving] = useState(false);
  const hasFetchedVendors = useRef(false); // Track if API has been called
  const lastFetchedId = useRef(null); // Track the last quotation_id fetched

  useEffect(() => {
    if (!id || !open) {
      hasFetchedVendors.current = false; // Reset when modal closes or id is null
      lastFetchedId.current = null;
      return;
    }

    // Skip if already fetched for this id
    if (hasFetchedVendors.current && lastFetchedId.current === id) {
      return;
    }

    const fetchVendors = async () => {
      try {
        console.log('Fetching vendors for id:', id, 'open:', open);
        hasFetchedVendors.current = true;
        lastFetchedId.current = id;
        await dispatch(getVendor(id)).unwrap();
      } catch (err) {
        handleError(err);
      }
    };

    fetchVendors();

    // No cleanup needed here since we reset on !id || !open
  }, [id, open, dispatch, handleError]);

  useEffect(() => {
    if (!vendorQuotationDetails?.length) {
      setData([]);
      return;
    }

    // Map vendorQuotationDetails to include only product_type_id 3 or 4
    const mappedData = vendorQuotationDetails
      .filter((item) => [3, 4].includes(item?.product_type_id?.value))
      .map((item, index) => {
        // Find existing vendor details for this quotation_detail_id
        const existingVendors = vendorDetails?.filter(
          (vendor) => vendor.quotation_detail_id === item.quotation_detail_id
        ) || [];

        // Create vendor entries, merging existing vendorDetails with defaults
        const vendors = Array.from({ length: vendorCount }, (_, vendorIndex) => {
          const existingVendor = existingVendors[vendorIndex] || null;
          return existingVendor
            ? {
              name: `Vendor ${vendorIndex + 1}`,
              rate: existingVendor.vendor_rate || 0,
              isPrimary: existingVendor.is_primary_vendor === 1,
              supplier_id: existingVendor.vendor
                ? { value: existingVendor.vendor.supplier_id, label: existingVendor.vendor.name }
                : null,
              rfqSent: existingVendor.rfq === 1,
            }
            : {
              name: `Vendor ${vendorIndex + 1}`,
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
          product_name:
            item.product_type_id?.value === 4
              ? item.product_name
              : item.product_id?.label || item.product_name || 'Unnamed Product',
          product_type_id: item.product_type_id,
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

  const onFinish = async () => {

    const invalidRows = data.filter((product) =>
      product.vendors.some((vendor) => vendor.isPrimary && !vendor.supplier_id)
    );
    if (invalidRows.length > 0) {
      toast.error('Primary vendors must have a selected supplier.');
      return;
    }

    setIsSaving(true);
    const payload = {
      quotation_id: initialFormValues?.quotation_id,
      quotation_detail: [],
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
        });
      });
    });

    try {
      await dispatch(postVendorSelection(payload)).unwrap();
      toast.success('Quotation Vendors Saved Successfully!');
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRateChange = (productIndex, vendorIndex, value) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[productIndex].vendors[vendorIndex].rate = value;
    setData(newData);
  };

  const handlePrimaryChange = (productIndex, vendorIndex) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[productIndex].vendors = newData[productIndex].vendors.map((vendor, idx) => ({
      ...vendor,
      isPrimary: idx === vendorIndex,
    }));
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
    ...Array.from({ length: vendorCount }).flatMap((_, vendorIndex) => [
      {
        title: `Vendor ${vendorIndex + 1}`,
        key: `supplier_id-${vendorIndex}`,
        width: 130,
        ellipsis: false,
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          return (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: 100 }}>
              <AsyncSelect
                endpoint="/supplier"
                valueKey="supplier_id"
                labelKey="name"
                labelInValue
                style={{ width: '100%', minWidth: 100 }}
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
        title: `Rate`,
        key: `rate-${vendorIndex}`,
        width: 140,
        maxWidth: 140,
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
        title: `Primary ${vendorIndex + 1}`,
        key: `vendor_primary_${vendorIndex}`,
        width: 100,
        ellipsis: true,
        render: (_, record, productIndex) => (
          <Radio
            checked={record.vendors[vendorIndex].isPrimary}
            onChange={() => handlePrimaryChange(productIndex, vendorIndex)}
          >
            Yes
          </Radio>
        ),
      },
      {
        title: `RFQ ${vendorIndex + 1}`,
        key: `vendor_rfq_${vendorIndex}`,
        width: 80,
        ellipsis: true,
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          return (
            <Switch
              checked={vendor.rfqSent}
              onChange={(checked) => toggleRfq(productIndex, vendorIndex, checked)}
              checkedChildren="Sent"
              unCheckedChildren="Send"
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
      title="Select Vendors"
      width="95%"
    >
      <Spin spinning={isItemVendorLoading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          // virtual
          // bordered
          // scroll={{ x: 'calc(100% - 200px)' }}
          scroll={{ x: 'calc(100% - 200px)', y: 400 }}
        />
      </Spin>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" onClick={onFinish} loading={isSaving}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default VendorSelectionModal;