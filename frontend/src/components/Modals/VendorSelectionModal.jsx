import { Modal, Table, Input, Spin, Radio, Button, Switch } from 'antd';
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
    initialFormValues,
    quotationDetails,
    permissions,
    vendorDetails,
    isItemVendorLoading
  } = useSelector((state) => state.quotation);

  const id = initialFormValues?.quotation_id;

  const [data, setData] = useState([]);
  const [vendorCount, setVendorCount] = useState(4);
  const [isSaving, setIsSaving] = useState(false);


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
          { name: 'Vendor 1', rate: 0, isPrimary: true, supplier_id: null, rfqSent: false },
          { name: 'Vendor 2', rate: 0, isPrimary: false, supplier_id: null, rfqSent: false },
          { name: 'Vendor 3', rate: 0, isPrimary: false, supplier_id: null, rfqSent: false },
          { name: 'Vendor 4', rate: 0, isPrimary: false, supplier_id: null, rfqSent: false },
        ],
      }));

      if (vendorDetails?.length > 0) {
        setData(vendorDetails);
      } else {
        setData(mappedData);
      }
    }
  }, [quotationDetails, vendorDetails]);

  // const sendRfq = async (productIndex, vendorIndex, checked) => {
  //   const newData = JSON.parse(JSON.stringify(data));
  //   const product = newData[productIndex];
  //   const vendor = product.vendors[vendorIndex];

  //   let quotation_detail_id = product?.quotation_detail_id;

  //   if (!quotation_detail_id && quotationDetails?.length > 0) {
  //     quotation_detail_id = quotationDetails[productIndex]?.quotation_detail_id;
  //   }

  //   const vendor_id = vendor?.supplier_id?.value;

  //   const payload = {
  //     quotation_id: initialFormValues?.quotation_id,
  //     quotation_detail_id,
  //     vendor_id,
  //   };

  //   try {
  //     if (checked) {
  //       await dispatch(postRfq(payload)).unwrap();
  //       vendor.rfqSent = true;
  //       toast.success('RFQ Sent Successfully!');
  //     } else {
  //       vendor.rfqSent = false;
  //       toast.success('RFQ Unmarked');
  //     }

  //     newData[productIndex].vendors[vendorIndex] = vendor;
  //     setData(newData);
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  const toggleRfq = (productIndex, vendorIndex, checked) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[productIndex].vendors[vendorIndex].rfqSent = checked;
    setData(newData);
  };

  const onFinish = async () => {
    setIsSaving(true);
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
          rfq: vendor.rfqSent ? 1 : 0,
        });
      });
    });

    try {
      await dispatch(postVendorSelection(payload)).unwrap()
      toast.success('Quotation Vendors Saved Successfully!')
      onClose()
    } catch (error) {
      handleError(error)
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
    const newData = JSON.parse(JSON.stringify(data));;
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
      width: 140,
    },
    ...Array.from({ length: vendorCount }).flatMap((_, vendorIndex) => [
      {
        title: `Vendor ${vendorIndex + 1}`,
        key: `supplier_id-${vendorIndex}`,
        width: 100,
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
        // title: `Rate ${vendorIndex + 1}`,
        title: `Rate`,
        key: `rate-${vendorIndex}`,
        width: 120,
        maxWidth: 120,
        ellipsis: true,
        render: (_, record, productIndex) => (
          <Input
            value={record.vendors[vendorIndex].rate}
            onChange={(e) =>
              handleRateChange(productIndex, vendorIndex, e.target.value)
            }
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
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          return (
            // <Switch
            //   checked={vendor.isPrimary}
            //   onChange={(checked) => {
            //     const newData = JSON.parse(JSON.stringify(data));
            //     if (checked) {
            //       newData[productIndex].vendors = newData[productIndex].vendors.map((vendor, idx) => ({
            //         ...vendor,
            //         isPrimary: idx === vendorIndex
            //       }));
            //     } else {
            //       newData[productIndex].vendors[vendorIndex].isPrimary = false;
            //     }
            //     setData(newData);
            //   }}
            //   checkedChildren="Yes"
            //   unCheckedChildren="No"
            // />
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
        width: 60,
        ellipsis: true,
        render: (_, record, productIndex) => {
          const vendor = record.vendors[vendorIndex];
          const isDisable = vendorDetails.length > 0
          return (
            <Switch
              checked={vendor.rfqSent}
              // disabled={isDisable || !vendor?.supplier_id?.value}
              onChange={(checked) => toggleRfq(productIndex, vendorIndex, checked)}
              checkedChildren="Sent"
              unCheckedChildren="Send"
            />
          )
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
          bordered
          scroll={{ x: 'max-content' }}
        />
      </Spin>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          onClick={onFinish}
          loading={isSaving}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default VendorSelectionModal;