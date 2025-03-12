/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import useError from '../../hooks/useError';
import {
  addGoodsReceivedNoteDetail,
  changeGoodsReceivedNoteDetailOrder,
  changeGoodsReceivedNoteDetailValue,
  copyGoodsReceivedNoteDetail,
  getGoodsReceivedNoteForPrint,
  removeGoodsReceivedNoteDetail,
  resetGoodsReceivedNoteDetail,
  setGoodsReceivedNoteDetails
} from '../../store/features/goodsReceivedNoteSlice';
import { getProduct, getProductList } from '../../store/features/productSlice';
import { getPurchaseOrder } from '../../store/features/purchaseOrderSlice';
import { createGoodsReceivedNotePrint } from '../../utils/prints/goods-received-note-print';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const GoodsReceivedNoteForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const type = Form.useWatch('type', form);

  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, goodsReceivedNoteDetails } = useSelector(
    (state) => state.goodsReceivedNote
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;
  const currency = user.currency;

  let totalQuantity = 0;

  goodsReceivedNoteDetails.forEach((detail) => {
    totalQuantity += +detail.quantity || 0;
  });

  const onFinish = (values) => {
    const data = {
      default_currency_id: currency ? currency.currency_id : null,
      type: values.type,
      remarks: values.remarks,
      supplier_id: values.supplier_id ? values.supplier_id.value : null,
      quotation_id: values.quotation_id,
      charge_order_id: values.charge_order_id,
      purchase_order_id: values.purchase_order_id ? values.purchase_order_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      good_received_note_detail: goodsReceivedNoteDetails.map(({ id, ...detail }, index) => ({
        ...detail,
        product_id: detail.product_type_id?.value == 4 ? null : detail.product_id.value,
        product_name: detail.product_type_id?.value == 4 ? detail.product_name : null,
        product_type_id: detail.product_type_id ? detail.product_type_id.value : null,
        warehouse_id: detail.warehouse_id ? detail.warehouse_id.value : null,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        sort_order: index
      })),
      total_quantity: totalQuantity
    };

    onSubmit(data);
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value, stock: true })).unwrap();

      if (!res.data.length) return;

      const product = res.data[0];

      form.setFieldsValue({
        [`product_id-${index}`]: product?.product_id
          ? {
              value: product.product_id,
              label: product.product_name
            }
          : null,
        [`product_description-${index}`]: product?.product_name || ''
      });

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_id',
          value: {
            value: product.product_id,
            label: product.product_name
          }
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_description',
          value: product?.product_name || ''
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_type_id',
          value: product.product_type_id
            ? {
                value: product.product_type_id,
                label: product.product_type_name
              }
            : null
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'rate',
          value: product.sale_price
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onProductChange = async (index, selected) => {
    dispatch(
      changeGoodsReceivedNoteDetailValue({
        index,
        key: 'product_id',
        value: selected
      })
    );

    if (!selected) {
      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_code',
          value: null
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_type',
          value: null
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'unit_id',
          value: null
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'rate',
          value: null
        })
      );
      return;
    }

    form.setFieldsValue({
      [`product_description-${index}`]: selected?.label || ''
    });

    dispatch(
      changeGoodsReceivedNoteDetailValue({
        index,
        key: 'product_description',
        value: selected?.label || ''
      })
    );

    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_code',
          value: product.product_code
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_type_id',
          value: product.product_type_id
            ? {
                value: product.product_type_id,
                label: product.product_type_name
              }
            : null
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'rate',
          value: product.sale_price
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onPOChange = async (selected) => {
    if (!selected) return;
    dispatch(setGoodsReceivedNoteDetails([]));

    try {
      const { purchase_order_detail, ...values } = await dispatch(
        getPurchaseOrder(selected.value)
      ).unwrap();

      if (values.type === 'Buyout') {
        form.setFieldsValue({
          type: values.type,
          charge_order_id: values.charge_order_id || null,
          quotation_id: values.quotation_id || null,
          event_id: values?.charge_order?.event
            ? {
                value: values?.charge_order?.event.event_id,
                label: values?.charge_order?.event.event_name
              }
            : null,
          customer_id: values?.charge_order?.customer
            ? {
                value: values?.charge_order?.customer.customer_id,
                label: values?.charge_order?.customer.name
              }
            : null,
          supplier_id: values?.supplier
            ? {
                value: values?.supplier.supplier_id,
                label: values?.supplier.name
              }
            : null,
          charge_no: values?.charge_order?.document_identity || null,
          purchase_order_no: values?.charge_order?.customer_po_no || null
        });
      } else {
        form.setFieldsValue({
          type: values.type,
          supplier_id: values?.supplier
            ? {
                value: values?.supplier.supplier_id,
                label: values?.supplier.name
              }
            : null
        });
      }

      if (!purchase_order_detail || !purchase_order_detail.length) return;

      const details = purchase_order_detail
        .map((detail) => ({
          id: detail.purchase_order_detail_id,
          purchase_order_detail_id: detail.purchase_order_detail_id,
          product_type_id: detail.product_type
            ? {
                value: detail.product_type.product_type_id,
                label: detail.product_type.name
              }
            : null,
          product_code: detail.product ? detail.product.product_code : null,
          product_id: detail.product
            ? { value: detail.product.product_id, label: detail.product.product_name }
            : null,
          product_name: detail.product_name,
          product_description: detail.product_description,
          description: detail.description,
          quantity: detail?.available_quantity ? parseFloat(detail?.available_quantity) : null,
          unit_id: detail.unit ? { value: detail.unit.unit_id, label: detail.unit.name } : null
        }))
        .filter((item) => item.quantity > 0);

      dispatch(setGoodsReceivedNoteDetails(details));
    } catch (error) {
      handleError(error);
    }
  };

  const printGoodsReceivedNote = async () => {
    const loadingToast = toast.loading('Loading print...');
    try {
      const data = await dispatch(getGoodsReceivedNoteForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createGoodsReceivedNotePrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addGoodsReceivedNoteDetail())}
        />
      ),
      key: 'order',
      dataIndex: 'order',
      render: (_, record, index) => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropup size={16} />}
              disabled={index === 0}
              onClick={() => {
                dispatch(changeGoodsReceivedNoteDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === goodsReceivedNoteDetails.length - 1}
              onClick={() => {
                dispatch(changeGoodsReceivedNoteDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50
    },
    {
      title: 'Product Type',
      dataIndex: 'product_type',
      key: 'product_type',
      render: (_, { product_code, product_type_id }, index) => {
        return (
          <AsyncSelectNoPaginate
            endpoint="/lookups/product-types"
            valueKey="product_type_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={product_type_id}
            onChange={(selected) => {
              dispatch(resetGoodsReceivedNoteDetail(index));
              dispatch(
                changeGoodsReceivedNoteDetailValue({
                  index,
                  key: 'product_type_id',
                  value: selected
                })
              );
            }}
          />
        );
      },
      width: 150
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      render: (_, { product_code, product_type_id }, index) => {
        return (
          <DebounceInput
            value={product_code}
            onChange={(value) =>
              dispatch(
                changeGoodsReceivedNoteDetailValue({
                  index,
                  key: 'product_code',
                  value: value
                })
              )
            }
            disabled={product_type_id?.value == 4}
            onBlur={(e) => onProductCodeChange(index, e.target.value)}
            onPressEnter={(e) => onProductCodeChange(index, e.target.value)}
          />
        );
      },
      width: 120
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (_, { product_id, product_name, product_type_id }, index) => {
        return product_type_id?.value == 4 ? (
          <Form.Item
            className="m-0"
            name={`product_name-${index}`}
            initialValue={product_name}
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Product Name is required'
              }
            ]}>
            <DebounceInput
              value={product_name}
              onChange={(value) => {
                dispatch(
                  changeGoodsReceivedNoteDetailValue({
                    index,
                    key: 'product_name',
                    value: value
                  })
                );

                form.setFieldsValue({
                  [`product_description-${index}`]: value
                });

                dispatch(
                  changeGoodsReceivedNoteDetailValue({
                    index,
                    key: 'product_description',
                    value: value
                  })
                );
              }}
            />
          </Form.Item>
        ) : (
          <Form.Item
            className="m-0"
            name={`product_id-${index}`}
            initialValue={product_id}
            rules={[
              {
                required: true,
                message: 'Product Name is required'
              }
            ]}>
            <AsyncSelect
              endpoint="/product"
              valueKey="product_id"
              labelKey="product_name"
              labelInValue
              className="w-full"
              value={product_id}
              onChange={(selected) => onProductChange(index, selected)}
              addNewLink={
                permissions.product.list && permissions.product.add ? '/product/create' : null
              }
            />
          </Form.Item>
        );
      },
      width: 560
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      render: (_, { product_description, product_type_id }, index) => {
        return (
          <Form.Item
            className="m-0"
            name={`product_description-${index}`}
            initialValue={product_description}
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Description is required'
              }
            ]}>
            <DebounceInput
              value={product_description}
              disabled={product_type_id?.value == 4}
              onChange={(value) =>
                dispatch(
                  changeGoodsReceivedNoteDetailValue({
                    index,
                    key: 'product_description',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
        );
      },
      width: 300
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      render: (_, { description }, index) => {
        return (
          <DebounceInput
            value={description}
            onChange={(value) =>
              dispatch(
                changeGoodsReceivedNoteDetailValue({
                  index,
                  key: 'description',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 240
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, { quantity }, index) => {
        form.setFieldsValue({ [`quantity-${index}`]: quantity });
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${index}`}
            initialValue={quantity}
            rules={[
              {
                required: true,
                message: 'Quantity is required'
              }
            ]}>
            <DebouncedCommaSeparatedInput
              decimalPlaces={2}
              value={quantity}
              onChange={(value) =>
                dispatch(
                  changeGoodsReceivedNoteDetailValue({
                    index,
                    key: 'quantity',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
        );
      },
      width: 100
    },
    {
      title: 'Unit',
      dataIndex: 'unit_id',
      key: 'unit_id',
      render: (_, { unit_id, product_type_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/unit"
            valueKey="unit_id"
            labelKey="name"
            disabled={product_type_id?.value != 4}
            labelInValue
            className="w-full"
            value={unit_id}
            onChange={(selected) =>
              dispatch(
                changeGoodsReceivedNoteDetailValue({
                  index,
                  key: 'unit_id',
                  value: selected
                })
              )
            }
            addNewLink={permissions.unit.list && permissions.unit.add ? '/unit' : null}
          />
        );
      },
      width: 120
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
      render: (_, { warehouse_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/warehouse"
            valueKey="warehouse_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={warehouse_id}
            onChange={(selected) =>
              dispatch(
                changeGoodsReceivedNoteDetailValue({
                  index,
                  key: 'warehouse_id',
                  value: selected
                })
              )
            }
            addNewLink={
              permissions.warehouse.list && permissions.warehouse.add ? '/warehouse' : null
            }
          />
        );
      },
      width: 200
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addGoodsReceivedNoteDetail())}
        />
      ),
      key: 'action',
      render: (_, { id }, index) => (
        <Dropdown
          trigger={['click']}
          arrow
          menu={{
            items: [
              {
                key: '1',
                label: 'Add',
                onClick: () => dispatch(addGoodsReceivedNoteDetail(index))
              },
              {
                key: '2',
                label: 'Copy',
                onClick: () => dispatch(copyGoodsReceivedNoteDetail(index))
              },
              {
                key: '3',
                label: 'Delete',
                danger: true,
                onClick: () => dispatch(removeGoodsReceivedNoteDetail(id))
              }
            ]
          }}>
          <Button size="small">
            <BsThreeDotsVertical />
          </Button>
        </Dropdown>
      ),
      width: 50,
      fixed: 'right'
    }
  ];

  return (
    <Form
      name="goodsReceivedNote"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={
        mode === 'edit'
          ? initialFormValues
          : {
              document_date: dayjs()
            }
      }
      scrollToFirstError>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">GRN No:</span>
        <span
          className={`ml-4 text-amber-600 ${
            mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
          } rounded px-1`}
          onClick={() => {
            if (mode !== 'edit') return;
            navigator.clipboard.writeText(initialFormValues?.document_identity);
            toast.success('Copied');
          }}>
          {mode === 'edit' ? initialFormValues?.document_identity : 'AUTO'}
        </span>
      </p>

      {/* Hidden Fields */}
      <Form.Item name="type" hidden />

      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="document_date"
            label="GRN Date"
            rules={[{ required: true, message: 'GRN Date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="supplier_id" label="Vendor">
            <AsyncSelect
              endpoint="/supplier"
              valueKey="supplier_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.supplier.list && permissions.supplier.add ? '/vendor/create' : null
              }
            />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="purchase_order_id" label="Purchase Order">
            <AsyncSelect
              endpoint="/purchase-order"
              valueKey="purchase_order_id"
              labelKey="document_identity"
              labelInValue
              params={{
                available_po: 1
              }}
              onChange={onPOChange}
              addNewLink={
                permissions.purchase_order.list && permissions.purchase_order.add
                  ? '/purchase-order/create'
                  : null
              }
            />
          </Form.Item>
        </Col>

        {type === 'Buyout' && (
          <>
            <Col span={24} sm={12} md={8} lg={8} className="flex gap-3">
              <Form.Item name="charge_no" label="Charge No" className="w-full">
                <Input disabled />
              </Form.Item>

              <Form.Item name="purchase_order_no" label="Purchase Order No" className="w-full">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="event_id" label="Event">
                <Select labelInValue disabled />
              </Form.Item>
            </Col>

            <Col span={24} sm={12} md={8} lg={8}>
              <Form.Item name="customer_id" label="Customer">
                <Select labelInValue disabled />
              </Form.Item>
            </Col>
          </>
        )}
        {/* 
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="payment_id" label="Payment Terms">
            <AsyncSelect
              endpoint="/payment"
              valueKey="payment_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.payment.list && permissions.payment.add ? '/payment' : null}
            />
          </Form.Item>
        </Col> */}

        <Col span={24} sm={24} md={16} lg={16}>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!border-gray-300">
        GRN Items
      </Divider>

      <Table
        columns={columns}
        dataSource={goodsReceivedNoteDetails}
        rowKey={'id'}
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
      />

      <div className="flex flex-wrap gap-4 rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
        <DetailSummaryInfo title="Total Quantity:" value={totalQuantity} />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/goods-received-note">
          <Button className="w-28">Cancel</Button>
        </Link>
        {mode === 'edit' ? (
          <Button
            type="primary"
            className="w-28 bg-rose-600 hover:!bg-rose-500"
            // onClick={printGoodsReceivedNote}
          >
            Print
          </Button>
        ) : null}
        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting}
          onClick={() => form.submit()}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default GoodsReceivedNoteForm;
