import { Modal, Table, Input, Radio, Button } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVendor } from '../../store/features/quotationSlice';
import AsyncSelect from '../AsyncSelect';
import { postVendorSelection, postRfq } from '../../store/features/quotationSlice';
import toast from 'react-hot-toast';
import useError from '../../hooks/useError';

const VendorSelectionModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const handleError = useError();

  const {
    isFormSubmitting,
    initialFormValues,
    quotationDetails,
    permissions,
    vendorDetails
  } = useSelector((state) => state.quotation);

  const id = initialFormValues?.quotation_id;

  const [data, setData] = useState([]);
  const [vendorCount, setVendorCount] = useState(4);


  useEffect(() => {
    if (!id || !open) return;

    const fetchVendors = async () => {
      try {
        await dispatch(getVendor(id)).unwrap();
      } catch (err) {
        handleError(err);
      }
    };

    fetchVendors();
  }, [id, open]);

  useEffect(() => {
    if (quotationDetails?.length > 0) {
      const filteredDetails = quotationDetails.filter(
        (item) =>
          item?.product_type_id?.value === 3 ||
          item?.product_type_id?.value === 4
      );

      const mappedData = filteredDetails.map((item, index) => ({
        key: item.id || String(index + 1),
        product_name:
          item.product_type_id?.value === 4
            ? item.product_name
            : item.product_id?.label || item.product_name || 'Unnamed Product',
        product_type_id: item.product_type_id,
        index,
        vendors: [
          { name: 'Vendor 1', rate: 0, isPrimary: index === 0, supplier_id: null },
          { name: 'Vendor 2', rate: 0, isPrimary: false, supplier_id: null },
          { name: 'Vendor 3', rate: 0, isPrimary: false, supplier_id: null },
          { name: 'Vendor 4', rate: 0, isPrimary: false, supplier_id: null },
        ],
      }));

      if (vendorDetails?.length > 0) {
        setData(vendorDetails);
      } else {
        setData(mappedData);
      }
    }
  }, [quotationDetails, vendorDetails]);

  const sendRfq = async (productIndex, vendorIndex) => {
    const product = data[productIndex];
    const vendor = product.vendors[vendorIndex];

    const quotation_detail_id = product?.quotation_detail_id;
    const vendor_id = vendor?.supplier_id?.value;

    const payload = {
      quotation_id: initialFormValues?.quotation_id,
      quotation_detail_id,
      vendor_id,
    };

    try {
      await dispatch(postRfq(payload)).unwrap();
      toast.success('RFQ Sent Successfully!');
    } catch (error) {
      handleError(error);
    }
  };

  const onFinish = async () => {
    const payload = {
      quotation_id: initialFormValues?.quotation_id,
      quotation_detail: [],
    };

    data.forEach((product, index) => {
      const quotation_detail_id = quotationDetails[index]?.quotation_detail_id;

      product.vendors.forEach((vendor) => {
        const supplier = vendor?.supplier_id?.value || null;

        payload.quotation_detail.push({
          vendor_id: supplier,
          quotation_detail_id,
          vendor_rate: vendor.rate ? parseFloat(vendor.rate) : null,
          is_primary_vendor: vendor.isPrimary ? 1 : 0,
        });
      });
    });

    try {
      await dispatch(postVendorSelection(payload)).unwrap()
      toast.success('Quotation Vendors Saved Successfully!')
    } catch (error) {
      handleError(error)
    }
  };

  const handleRateChange = (productIndex, vendorIndex, value) => {
    const newData = [...data];
    newData[productIndex].vendors[vendorIndex].rate = value;
    setData(newData);
  };

  const handlePrimaryChange = (productIndex, vendorIndex) => {
    const newData = [...data];
    newData[productIndex].vendors = newData[productIndex].vendors.map((vendor, idx) => ({
      ...vendor,
      isPrimary: idx === vendorIndex
    }));
    setData(newData);
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      fixed: 'left',
      width: 200,
    },
    ...Array.from({ length: vendorCount }).flatMap((_, vendorIndex) => [
      {
        title: `Vendor ${vendorIndex + 1}`,
        key: `supplier_id-${vendorIndex}`,
        width: 140,
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          return (
            <AsyncSelect
              endpoint="/supplier"
              valueKey="supplier_id"
              labelKey="name"
              labelInValue
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
          );
        },
      },
      {
        title: `Rate ${vendorIndex + 1}`,
        key: `rate-${vendorIndex}`,
        width: 60,
        render: (_, record, productIndex) => (
          <Input
            value={record.vendors[vendorIndex].rate}
            onChange={(e) =>
              handleRateChange(productIndex, vendorIndex, e.target.value)
            }
            placeholder="Rate"
            style={{ width: '90px' }}
          />
        ),
      },
      {
        title: `Primary ${vendorIndex + 1}`,
        key: `vendor_primary_${vendorIndex}`,
        width: 100,
        render: (_, record, productIndex) => {
          return (
            <Radio
              checked={record.vendors[vendorIndex].isPrimary}
              onChange={() => handlePrimaryChange(productIndex, vendorIndex)}
            >
              Yes
            </Radio>
          )
        },
      },
      {
        title: `RFQ ${vendorIndex + 1}`,
        key: `vendor_rfq_${vendorIndex}`,
        width: 80,
        render: (_, record, productIndex) => (
          <Button type="link" size="small" onClick={() => sendRfq(productIndex, vendorIndex)}>
            Send RFQ
          </Button>
        ),
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
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          onClick={onFinish}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default VendorSelectionModal;
