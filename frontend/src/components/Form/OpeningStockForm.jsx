/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Divider, Dropdown, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import useError from '../../hooks/useError';
import {
  addOpeningStockDetail,
  changeOpeningStockDetailOrder,
  changeOpeningStockDetailValue,
  copyOpeningStockDetail,
  getOpeningStockForPrint,
  removeOpeningStockDetail,
  resetOpeningStockDetail,
  setOpeningStockDetails
} from '../../store/features/openingStockSlice';
import { getProduct, getProductList } from '../../store/features/productSlice';
import { createOpeningStockPrint } from '../../utils/prints/opening-stock-print';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const OpeningStockForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const type = Form.useWatch('type', form);
  const selectedWarehouse = Form.useWatch('warehouse_id', form);
  const [submitAction, setSubmitAction] = useState(null);

  useEffect(() => {
    if (!selectedWarehouse) return;

    openingStockDetails.forEach((detail, index) => {
      const hasWarehouse = detail.warehouse_id?.value;
      if (!hasWarehouse) {
        dispatch(
          changeOpeningStockDetailValue({
            index,
            key: 'warehouse_id',
            value: selectedWarehouse
          })
        );

        form.setFieldsValue({
          [`warehouse_id-${index}`]: selectedWarehouse
        });
      }
    });
  }, [selectedWarehouse]);

  const handleError = useError();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isFormSubmitting, initialFormValues, openingStockDetails } = useSelector(
    (state) => state.openingStock
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;
  const currency = user.currency;

  let totalQuantity = 0;

  openingStockDetails.forEach((detail) => {
    totalQuantity += +detail.quantity || 0;
  });

  const onFinish = (values) => {
    const edit = mode;
    const deletedDetails = openingStockDetails.filter((detail) => detail.isDeleted !== true);

    const filteredDetails = openingStockDetails.filter(
      (detail) => !(detail.isDeleted && detail.row_status === 'I')
    );

    const mappingSource = edit === 'edit' ? openingStockDetails : deletedDetails;

    const data = {
      default_currency_id: currency ? currency.currency_id : null,
      type: values.type,
      remarks: values.remarks,
      charge_order_id: values.charge_order_id,
      warehouse_id: values.warehouse_id ? values.warehouse_id.value : null,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      opening_stock_detail: mappingSource.map(
        ({ id, row_status, isDeleted, ...detail }, index) => {
          return {
            ...detail,
            product_id: detail.product_type_id?.value == 4 ? null : detail.product_id.value,
            product_name: detail.product_type_id?.value == 4 ? detail.product_name : null,
            product_type_id: detail.product_type_id ? detail.product_type_id.value : null,
            warehouse_id: detail.warehouse_id ? detail.warehouse_id.value : null,
            unit_id: detail.unit_id ? detail.unit_id.value : null,
            sort_order: index,
            opening_stock_detail_id: id ? id : null,
            ...(edit === 'edit' ? { row_status } : {})
          };
        }
      ),
      total_quantity: totalQuantity
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value, stock: true })).unwrap();

      const filteredProducts = res.data.filter(
        (product) => product.product_type_id === 2 || product.product_type_id?.product_type_id === 2
      );

      if (!filteredProducts.length) return;

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
        changeOpeningStockDetailValue({
          index,
          key: 'product_id',
          value: {
            value: product.product_id,
            label: product.product_name
          }
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'product_description',
          value: product?.product_name || ''
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
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
        changeOpeningStockDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
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
      changeOpeningStockDetailValue({
        index,
        key: 'product_id',
        value: selected
      })
    );

    if (!selected) {
      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'product_code',
          value: null
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'product_type',
          value: null
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'unit_id',
          value: null
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
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
      changeOpeningStockDetailValue({
        index,
        key: 'product_description',
        value: selected?.label || ''
      })
    );

    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'product_code',
          value: product.product_code
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
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
        changeOpeningStockDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price
        })
      );

      dispatch(
        changeOpeningStockDetailValue({
          index,
          key: 'rate',
          value: product.sale_price
        })
      );
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
          onClick={() => dispatch(addOpeningStockDetail({ defaultWarehouse: selectedWarehouse }))}
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
                dispatch(changeOpeningStockDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === openingStockDetails.length - 1}
              onClick={() => {
                dispatch(changeOpeningStockDetailOrder({ from: index, to: index + 1 }));
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
      render: (_, { product_type_id }, index) => {
        return (
          <AsyncSelectNoPaginate
            endpoint="/lookups/product-types"
            valueKey="product_type_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={product_type_id}
            filterFn={(product) => product?.product_type_id === 2}
            onChange={(selected) => {
              dispatch(resetOpeningStockDetail(index));
              dispatch(
                changeOpeningStockDetailValue({
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
                changeOpeningStockDetailValue({
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
        form.setFieldsValue({ [`product_name-${index}`]: product_name });
        form.setFieldsValue({ [`product_id-${index}`]: product_id });
        return (
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
              filterFn={(product) => product?.product_id === 2}
              onChange={(selected) => onProductChange(index, selected)}
              addNewLink={permissions.product.add ? '/product/create' : null}
            />
          </Form.Item>
        )
      },
      width: 560
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      render: (_, { product_description, product_type_id }, index) => {
        form.setFieldsValue({ [`product_description-${index}`]: product_description });
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
                  changeOpeningStockDetailValue({
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
                changeOpeningStockDetailValue({
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
        const newQuantity = Number(quantity)
          .toString()
          .replace(/(\.\d*?)0+$/, '$1')
          .replace(/\.$/, '');
        form.setFieldsValue({ [`quantity-${index}`]: newQuantity });
        return (
          <Form.Item
            className="m-0"
            name={`quantity-${index}`}
            initialValue={newQuantity}
            rules={[
              {
                required: true,
                message: 'Quantity is required'
              }
            ]}>
            <DebouncedCommaSeparatedInput
              decimalPlaces={2}
              value={newQuantity}
              onChange={(value) =>
                dispatch(
                  changeOpeningStockDetailValue({
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
                changeOpeningStockDetailValue({
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
      render: (_, { warehouse_id, product_type_id }, index) => {
        const isRequired = product_type_id?.value === 2;
        return (
          <Form.Item
            className="m-0"
            name={`warehouse_id-${index}`}
            initialValue={warehouse_id}
            rules={[{ required: true, message: 'Warehouse is required' }]}>
            <AsyncSelect
              endpoint="/warehouse"
              required
              valueKey="warehouse_id"
              labelKey="name"
              labelInValue
              className="w-full"
              value={warehouse_id}
              onChange={(selected) =>
                dispatch(
                  changeOpeningStockDetailValue({
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
          </Form.Item>
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
          onClick={() => dispatch(addOpeningStockDetail({ defaultWarehouse: selectedWarehouse }))}
        />
      ),
      key: 'action',
      render: (record, { id }, index) => {
        if (record.isDeleted) {
          return null;
        }
        return (
          <Dropdown
            trigger={['click']}
            arrow
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Add',
                  onClick: () => dispatch(addOpeningStockDetail({ index, defaultWarehouse: selectedWarehouse }))
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyOpeningStockDetail(index))
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeOpeningStockDetail(id))
                }
              ]
            }}>
            <Button size="small">
              <BsThreeDotsVertical />
            </Button>
          </Dropdown>
        );
      },
      width: 50,
      fixed: 'right'
    }
  ];

  return (
    <Form
      name="openingStock"
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
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-base font-semibold">
        <span className="text-gray-500">OPENING STOCK No:</span>
        <span
          className={`ml-4 text-amber-600 ${mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
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
            label="OS Date"
            rules={[{ required: true, message: 'OS Date is required' }]}
            className="w-full">
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={16} lg={16}>
          <Form.Item name="warehouse_id" label="Warehouse" rules={[{ required: true, message: 'Warehouse is required' }]}>
            <AsyncSelect
              endpoint="/warehouse"
              valueKey="warehouse_id"
              labelKey="name"
              labelInValue
              getOptionLabel={(option) => {
                return option.name;
              }}
              params={{
                available_po: 1
              }}
              addNewLink={permissions.warehouse.add ? '/purchase-order/create' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={24} lg={24}>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" className="!border-gray-300">
        Opening Stock Items
      </Divider>

      <Table
        columns={columns}
        dataSource={openingStockDetails}
        rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
        rowKey="id"
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
        <Link to="/opening-stock">
          <Button className="w-28">Exit</Button>
        </Link>
        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting && submitAction === 'save'}
          onClick={() => {
            setSubmitAction('save');
            form.submit();
          }}>
          Save
        </Button>
        <Button
          type="primary"
          className="w-28 bg-green-600 hover:!bg-green-500"
          loading={isFormSubmitting && submitAction === 'saveAndExit'}
          onClick={() => {
            setSubmitAction('saveAndExit');
            form.submit();
          }}>
          Save & Exit
        </Button>
      </div>
    </Form>
  );
};

export default OpeningStockForm;
