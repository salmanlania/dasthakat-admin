/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useError from '../../hooks/useError';
import {
  addGoodsReceivedNoteDetail,
  changeGoodsReceivedNoteDetailOrder,
  changeGoodsReceivedNoteDetailValue,
  copyGoodsReceivedNoteDetail,
  getGoodsReceivedNoteForPrint,
  removeGoodsReceivedNoteDetail
} from '../../store/features/goodsReceivedNoteSlice';
import { getProduct, getProductList } from '../../store/features/productSlice';
import { createGoodsReceivedNotePrint } from '../../utils/prints/goods-received-note-print';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const GoodsReceivedNoteForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, goodsReceivedNoteDetails } = useSelector(
    (state) => state.goodsReceivedNote
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;
  const currency = user.currency;

  let totalAmount = 0;
  let totalQuantity = 0;

  goodsReceivedNoteDetails.forEach((detail) => {
    totalAmount += +detail.amount || 0;
    totalQuantity += +detail.quantity || 0;
  });

  const onFinish = (values) => {
    if (!totalAmount) return toast.error('Total Amount cannot be zero');

    const data = {
      default_currency_id: currency ? currency.currency_id : null,
      type: values.type,
      remarks: values.remarks,
      supplier_id: values.supplier_id ? values.supplier_id.value : null,
      purchase_order_id: values.purchase_order_id ? values.purchase_order_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      good_received_note_detail: goodsReceivedNoteDetails.map(({ id, ...detail }, index) => ({
        ...detail,
        product_id: detail.product_id ? detail.product_id.value : null,
        warehouse_id: detail.warehouse_id ? detail.warehouse_id.value : null,
        unit_id: detail.unit_id ? detail.unit_id.value : null,
        sort_order: index
      })),
      total_amount: totalAmount,
      total_quantity: totalQuantity
    };

    onSubmit(data);
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value })).unwrap();

      if (!res.data.length) return;

      const product = res.data[0];
      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'product_id',
          value: {
            value: product.product_id,
            label: product.name
          }
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
          value: product.cost_price
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
    if (!selected) return;
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
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeGoodsReceivedNoteDetailValue({
          index,
          key: 'rate',
          value: product.cost_price
        })
      );
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
      title: 'Product Code',
      dataIndex: 'product_code',
      key: 'product_code',
      render: (_, { product_code }, index) => {
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
            onBlur={(e) => onProductCodeChange(index, e.target.value)}
            onPressEnter={(e) => onProductCodeChange(index, e.target.value)}
          />
        );
      },
      width: 120
    },
    {
      title: 'Description',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (_, { product_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/product"
            valueKey="product_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={product_id}
            onChange={(selected) => onProductChange(index, selected)}
            addNewLink={
              permissions.product.list && permissions.product.add ? '/product/create' : null
            }
          />
        );
      },
      width: 560
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
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${uuidv4()}`}
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
      render: (_, { unit_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/unit"
            valueKey="unit_id"
            labelKey="name"
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
      title: 'Unit Price',
      dataIndex: 'rate',
      key: 'rate',
      render: (_, { rate }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={rate}
            onChange={(value) =>
              dispatch(
                changeGoodsReceivedNoteDetailValue({
                  index,
                  key: 'rate',
                  value: value
                })
              )
            }
          />
        );
      },
      width: 120
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} disabled />
      ),
      width: 120
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
              addNewLink={
                permissions.purchase_order.list && permissions.purchase_order.add
                  ? '/purchase-order/create'
                  : null
              }
            />
          </Form.Item>
        </Col>

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
        </Col>

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
        <DetailSummaryInfo title="Total Amount:" value={totalAmount} />
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
