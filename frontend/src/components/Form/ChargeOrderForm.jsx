import { useState } from 'react';
import { Button, Col, DatePicker, Dropdown, Form, Input, Popover, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosWarning, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import useError from '../../hooks/useError';
import {
  addChargeOrderDetail,
  changeChargeOrderDetailOrder,
  changeChargeOrderDetailValue,
  copyChargeOrderDetail,
  removeChargeOrderDetail,
  resetChargeOrderDetail,
  splitChargeOrderQuantity,
  getChargeOrder
} from '../../store/features/chargeOrderSlice';
import { getEvent } from '../../store/features/eventSlice';
import { getProduct, getProductList } from '../../store/features/productSlice';
import { setChargePoID } from '../../store/features/purchaseOrderSlice.js';
import { formatThreeDigitCommas, roundUpto } from '../../utils/number';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate';
import DebounceInput from '../Input/DebounceInput';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebouncedNumberInput from '../Input/DebouncedNumberInput';
import { DetailSummaryInfo } from './QuotationForm';

// eslint-disable-next-line react/prop-types
const ChargeOrderForm = ({ mode, onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, chargeOrderDetails } = useSelector(
    (state) => state.chargeOrder
  );

  const { poChargeID } = useSelector((state) => state.purchaseOrder);

  const [searchParams] = useSearchParams();

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;

  const chargeOrder_id = searchParams.get('chargeOrder_id') || null;

  let totalQuantity = 0;
  let totalAmount = 0;
  let discountAmount = 0;
  let totalNet = 0;

  chargeOrderDetails.forEach((detail) => {
    totalQuantity += +detail.quantity || 0;
    totalAmount += +detail.amount || 0;
    discountAmount += +detail.discount_amount || 0;
    totalNet += +detail.gross_amount || 0;
  });

  const onFinish = async (additionalRequest = null) => {
    // validate the form
    const isValidFields = await form.validateFields();
    if (!isValidFields) return;

    // Get form values
    const values = form.getFieldsValue();

    const filteredDetails = chargeOrderDetails.filter(
      (detail) => !(detail.isDeleted && detail.row_status === 'I')
    );

    const data = {
      chargeOrder_id,
      remarks: values.remarks,
      customer_po_no: values.customer_po_no,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      customer_id: values.customer_id ? values.customer_id.value : null,
      event_id: values.event_id ? values.event_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      agent_id: values.agent_id ? values.agent_id.value : null,
      technician_notes: values.technician_notes,
      agent_notes: values.agent_notes,
      document_date: dayjs(values.document_date).format('YYYY-MM-DD')
        ? dayjs(values.document_date).format('YYYY-MM-DD')
        : null,
      user_id: values.user_id ? values.user_id.map((v) => v.value) : null,
      charge_order_detail: chargeOrderDetails.map(({ id, product_type, ...detail }, index) => {
        return {
          ...detail,
          picklist_id: detail?.picklist_id || '',
          picklist_detail_id: detail?.picklist_id || '',
          purchase_order_id: detail?.purchase_order_id || '',
          purchase_order_detail_id: detail?.purchase_order_detail_id || '',
          product_id: detail.product_type_id?.value == 4 ? null : detail?.product_id?.value,
          product_name: detail.product_type_id?.value == 4 ? detail?.product_name : null,
          supplier_id: detail.supplier_id ? detail.supplier_id.value : null,
          product_type_id: detail.product_type_id ? detail.product_type_id.value : null,
          unit_id: detail.unit_id ? detail.unit_id.value : null,
          markup: detail.product_type_id?.value === 1 ? 0 : detail.markup,
          cost_price: detail.product_type_id?.value === 1 ? 0 : detail.cost_price,
          sort_order: index,
          row_status: detail.row_status,
          charge_order_detail_id: id ? id : null
        };
      }),
      total_quantity: totalQuantity
    };

    await onSubmit(data, additionalRequest);

    if (additionalRequest === 'CREATE_PO') {
      dispatch(setChargePoID(id));
    }
  };

  const onProductCodeChange = async (index, value) => {
    if (!value.trim()) return;
    try {
      const res = await dispatch(getProductList({ product_code: value, stock: true })).unwrap();

      if (!res.data.length) return;

      const product = res.data[0];
      const stockQuantity = product?.stock?.quantity || 0;

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
        changeChargeOrderDetailValue({
          index,
          key: 'product_id',
          value: {
            value: product.product_id,
            label: product.product_name
          }
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'product_description',
          value: product?.product_name || ''
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
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
        changeChargeOrderDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'stock_quantity',
          value: stockQuantity
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
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
      changeChargeOrderDetailValue({
        index,
        key: 'product_id',
        value: selected
      })
    );

    if (!selected) {
      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'product_code',
          value: null
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'product_type',
          value: null
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'unit_id',
          value: null
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'cost_price',
          value: null
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
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
      changeChargeOrderDetailValue({
        index,
        key: 'product_description',
        value: selected?.label || ''
      })
    );

    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();

      const stockQuantity = product?.stock?.quantity || 0;

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'product_code',
          value: product.product_code
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
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
        changeChargeOrderDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name }
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'stock_quantity',
          value: stockQuantity
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price
        })
      );

      dispatch(
        changeChargeOrderDetailValue({
          index,
          key: 'rate',
          value: product.sale_price
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const [globalMarkup, setGlobalMarkup] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState('');

  const applyGlobalDiscount = (inputValue) => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      return;
    }
    const value = Number(trimmed);
    if (!isNaN(value)) {
      chargeOrderDetails.forEach((row, index) => {
        dispatch(
          changeChargeOrderDetailValue({
            index,
            key: 'discount_percent',
            value: value
          })
        );
      });
    }
  };

  const applyGlobalMarkup = (inputValue) => {
    const trimmed = inputValue.trim();
    if (trimmed === '' && trimmed !== '0') {
      return;
    }
    const value = Number(trimmed);
    if (!isNaN(value)) {
      chargeOrderDetails.forEach((row, index) => {
        if (row.product_type_id?.value === 1) {
          dispatch(
            changeChargeOrderDetailValue({
              index,
              key: 'markup',
              value: 0
            })
          );
        } else if (row.product_type_id?.value !== 1) {
          dispatch(
            changeChargeOrderDetailValue({
              index,
              key: 'markup',
              value: value
            })
          );
        }
      });
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
          onClick={() => dispatch(addChargeOrderDetail())}
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
                dispatch(changeChargeOrderDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === chargeOrderDetails.length - 1}
              onClick={() => {
                dispatch(changeChargeOrderDetailOrder({ from: index, to: index + 1 }));
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
      render: (_, { product_code, product_type_id, editable }, index) => {
        return (
          <AsyncSelectNoPaginate
            endpoint="/lookups/product-types"
            valueKey="product_type_id"
            labelKey="name"
            labelInValue
            className="w-full"
            value={product_type_id}
            disabled={editable === false}
            onChange={(selected) => {
              dispatch(resetChargeOrderDetail(index));
              dispatch(
                changeChargeOrderDetailValue({
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
                changeChargeOrderDetailValue({
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
            key={index}
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
                  changeChargeOrderDetailValue({
                    index,
                    key: 'product_name',
                    value: value
                  })
                );

                form.setFieldsValue({
                  [`product_description-${index}`]: value
                });

                dispatch(
                  changeChargeOrderDetailValue({
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
              addNewLink={permissions.product.add ? '/product/create' : null}
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
                  changeChargeOrderDetailValue({
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
      render: (_, { description, editable }, index) => {
        return (
          <DebounceInput
            value={description}
            disabled={editable === false}
            onChange={(value) =>
              dispatch(
                changeChargeOrderDetailValue({
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
      title: 'Internal Notes',
      dataIndex: 'internal_notes',
      key: 'internal_notes',
      render: (_, { internal_notes }, index) => {
        return (
          <DebounceInput
            value={internal_notes}
            onChange={(value) =>
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: 'internal_notes',
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
      title: 'Stock Quantity',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      render: (_, { stock_quantity }) => {
        return <Input value={stock_quantity} disabled />;
      },
      width: 122
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, { stock_quantity, quantity, editable, product_type_id }, index) => {
        const stockQuantityNum = stock_quantity ? parseFloat(stock_quantity) : 0;
        const quantityNum = quantity ? parseFloat(quantity) : 0;

        const isQuantityExceedsStock =
          product_type_id?.value == 2 && quantityNum > stockQuantityNum;

        form.setFieldsValue({ [`quantity-${index}`]: quantity });
        return (
          <div className="relative">
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
                disabled={editable === false}
                onChange={(value) =>
                  dispatch(
                    changeChargeOrderDetailValue({
                      index,
                      key: 'quantity',
                      value: value
                    })
                  )
                }
              />
            </Form.Item>
            {isQuantityExceedsStock && (
              <Popover
                content={
                  <div>
                    <p>Would you like to split the quantity?</p>

                    <div className="mt-2 flex w-full justify-end gap-2">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => dispatch(splitChargeOrderQuantity(index))}>
                        Yes
                      </Button>
                    </div>
                  </div>
                }
                title="Quantity Exceeds Stock">
                <IoIosWarning
                  size={18}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-red-500"
                />
              </Popover>
            )}
          </div>
        );
      },
      width: 100
    },
    {
      title: 'Unit',
      dataIndex: 'unit_id',
      key: 'unit_id',
      render: (_, { unit_id, product_type_id, editable }, index) => {
        return (
          <AsyncSelect
            endpoint="/unit"
            valueKey="unit_id"
            labelKey="name"
            disabled={product_type_id?.value != 4 || editable === false}
            labelInValue
            className="w-full"
            value={unit_id}
            onChange={(selected) =>
              dispatch(
                changeChargeOrderDetailValue({
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
      title: 'Vendor',
      dataIndex: 'supplier_id',
      key: 'supplier_id',
      render: (_, { supplier_id, product_type_id, editable }, index) => {
        return (
          <AsyncSelect
            endpoint="/supplier"
            valueKey="supplier_id"
            labelKey="name"
            labelInValue
            className="w-full"
            disabled={
              product_type_id?.value == 1 || product_type_id?.value == 2 || editable === false
            }
            value={supplier_id}
            onChange={(selected) =>
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: 'supplier_id',
                  value: selected
                })
              )
            }
            addNewLink={permissions.supplier.add ? '/vendor/create' : null}
          />
        );
      },
      width: 240
    },
    {
      title: 'Vendor Part #',
      dataIndex: 'vendor_part_no',
      key: 'vendor_part_no',
      render: (_, { vendor_part_no }, index) => {
        return (
          <DebounceInput
            value={vendor_part_no}
            onChange={(value) =>
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: 'vendor_part_no',
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
      title: 'Cost Price',
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (_, { cost_price, product_type_id }, index) => {
        const finalCost = product_type_id?.value === 1 ? '0' : cost_price;
        return (
          <DebouncedCommaSeparatedInput
            value={finalCost}
            disabled={product_type_id?.value == 1}
            onChange={(value) =>
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: 'cost_price',
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
      title: (
        <div className="flex flex-wrap items-center gap-1">
          <span>Markup %</span>
          <input
            value={globalMarkup}
            onChange={(e) => {
              const value = e.target.value;
              setGlobalMarkup(value);
              applyGlobalMarkup(value);
            }}
            placeholder="Markup %"
            style={{
              width: '80px',
              fontSize: '12px',
              padding: '2px 4px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px'
            }}
          />
        </div>
      ),
      dataIndex: 'markup',
      key: 'markup',
      render: (_, { markup, product_type_id, product_type }, index) => {
        return (
          <DebouncedNumberInput
            // value={markup}
            value={product_type_id?.value == 1 ? 0 : markup}
            type="decimal"
            // disabled={product_type_id?.value == 1}
            disabled={product_type_id?.value == 1 || product_type === 'Service'}
            onChange={(value) => {
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: 'markup',
                  // value: value
                  value: product_type === 'Service' ? 0 : value
                })
              );
            }}
          />
        );
      },
      width: 90
    },
    {
      title: 'Selling Price',
      dataIndex: 'rate',
      key: 'rate',
      render: (_, { rate, editable }, index) => {
        form.setFieldsValue({ [`rate-${index}`]: rate });
        return (
          <Form.Item
            className="m-0"
            name={`rate-${index}`}
            initialValue={rate}
            rules={[
              {
                required: true,
                message: 'Selling price is required'
              }
            ]}>
            <DebouncedCommaSeparatedInput
              value={rate}
              disabled={editable === false}
              onChange={(value) =>
                dispatch(
                  changeChargeOrderDetailValue({
                    index,
                    key: 'rate',
                    value: value
                  })
                )
              }
            />
          </Form.Item>
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
    // {
    //   title: 'Discount %',
    //   dataIndex: 'discount_percent',
    //   key: 'discount_percent',
    //   render: (_, { discount_percent, editable }, index) => {
    //     form.setFieldsValue({
    //       [`discount_percent-${index}`]: discount_percent
    //     });
    //     return (
    //       <Form.Item
    //         className="m-0"
    //         initialValue={discount_percent}
    //         name={`discount_percent-${index}`}
    //         rules={[
    //           {
    //             validator: (_, value) => {
    //               if (value > 100) {
    //                 return Promise.reject(new Error('Invalid discount percent.'));
    //               }
    //               return Promise.resolve();
    //             }
    //           }
    //         ]}>
    //         <DebouncedNumberInput
    //           value={discount_percent}
    //           type="decimal"
    //           disabled={editable === false}
    //           onChange={(value) =>
    //             dispatch(
    //               changeChargeOrderDetailValue({
    //                 index,
    //                 key: 'discount_percent',
    //                 value: value
    //               })
    //             )
    //           }
    //         />
    //       </Form.Item>
    //     );
    //   },
    //   width: 100
    // },
    {
      title: (
        <div className="flex flex-wrap">
          <span>Discount %</span>
          <input
            value={globalDiscount}
            onChange={(e) => {
              const value = e.target.value;
              setGlobalDiscount(value);
              applyGlobalDiscount(value);
            }}
            placeholder="Discount %"
            style={{
              width: '80px',
              fontSize: '12px',
              padding: '2px 4px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px'
            }}
          />
        </div>
      ),
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      render: (_, { discount_percent }, index) => {
        form.setFieldsValue({
          [`discount_percent-${index}`]: discount_percent
        });
        return (
          <Form.Item
            className="m-0"
            initialValue={discount_percent}
            name={`discount_percent-${index}`}
            rules={[
              {
                validator: (_, value) => {
                  if (value > 100) {
                    return Promise.reject(new Error('Invalid discount percent.'));
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <DebouncedNumberInput
              value={discount_percent}
              type="decimal"
              onChange={(value) =>
                dispatch(
                  changeChargeOrderDetailValue({
                    index,
                    key: 'discount_percent',
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
      title: 'Discount Amt',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      render: (_, { discount_amount }) => {
        return (
          <DebouncedCommaSeparatedInput
            value={discount_amount ? discount_amount + '' : ''}
            disabled
          />
        );
      },
      width: 120
    },
    {
      title: 'Gross Amount',
      dataIndex: 'gross_amount',
      key: 'gross_amount',
      render: (_, { gross_amount }) => {
        return (
          <DebouncedCommaSeparatedInput value={gross_amount ? gross_amount + '' : ''} disabled />
        );
      },
      width: 150
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addChargeOrderDetail())}
        />
      ),
      key: 'action',
      render: (record, { id, editable }, index) => {
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
                  onClick: () => dispatch(addChargeOrderDetail(index))
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyChargeOrderDetail(index))
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeChargeOrderDetail(id)),
                  disabled: editable === false
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

  const onEventChange = async (selected) => {
    form.setFieldsValue({
      vessel_id: null,
      customer_id: null,
      class1_id: null,
      class2_id: null,
      flag_id: null
    });

    if (!selected) return;
    try {
      const data = await dispatch(getEvent(selected.value)).unwrap();
      form.setFieldsValue({
        vessel_id: { value: data.vessel_id, label: data.vessel_name },
        customer_id: { value: data.customer_id, label: data.customer_name },
        class1_id: { value: data.class1_id, label: data.class1_name },
        class2_id: { value: data.class2_id, label: data.class2_name },
        flag_id: { value: data.flag_id, label: data.flag_name }
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Form
      name="chargeOrder"
      layout="vertical"
      autoComplete="off"
      form={form}
      initialValues={
        mode === 'edit' || chargeOrder_id
          ? initialFormValues
          : {
              document_date: dayjs()
            }
      }>
      {/* Make this sticky */}
      <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-xs font-semibold">
        <span className="text-gray-500">Charge order No:</span>
        <span
          className={`ml-4 text-amber-600 ${
            mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : 'select-none'
          } rounded px-1`}
          onClick={() => {
            if (mode !== 'edit') return;
            navigator.clipboard.writeText(initialFormValues.document_identity);
            toast.success('Copied');
          }}>
          {mode === 'edit' ? initialFormValues.document_identity : 'AUTO'}
        </span>
      </p>

      <Row gutter={12}>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="document_date"
            label="Charge Order Date"
            rules={[{ required: true, message: 'charge order date is required' }]}>
            <DatePicker format="MM-DD-YYYY" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_po_no" label="Customer PO No">
            <Input />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="salesman_id"
            label="Salesman"
            rules={[{ required: true, message: 'Salesman is required' }]}>
            <AsyncSelect
              endpoint="/salesman"
              valueKey="salesman_id"
              labelKey="name"
              labelInValue
              addNewLink={
                permissions.salesman.list && permissions.salesman.add ? '/salesman' : null
              }
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item
            name="event_id"
            label="Event"
            rules={[{ required: true, message: 'Event is required' }]}>
            <AsyncSelect
              endpoint="/event"
              valueKey="event_id"
              labelKey="event_name"
              labelInValue
              onChange={onEventChange}
              addNewLink={permissions.event.add ? '/event/create' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="vessel_id" label="Vessel">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="customer_id" label="Customer">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>

        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class1_id" label="Class 1">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="class2_id" label="Class 2">
            <Select labelInValue disabled />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="flag_id" label="Flag">
            <AsyncSelect
              endpoint="/flag"
              valueKey="flag_id"
              labelKey="name"
              labelInValue
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="user_id" label="Technician">
            <AsyncSelect
              endpoint="/user"
              valueKey="user_id"
              labelKey="user_name"
              mode="multiple"
              labelInValue
              addNewLink={permissions.user.add ? '/user/create' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="technician_notes" label="Technician Notes">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="agent_id" label="Agent">
            <AsyncSelect
              endpoint="/agent"
              valueKey="agent_id"
              labelKey="name"
              labelInValue
              addNewLink={permissions.agent.add ? '/agent/create' : null}
            />
          </Form.Item>
        </Col>
        <Col span={24} sm={12} md={8} lg={8}>
          <Form.Item name="agent_notes" label="Agent Notes">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
        <Col span={24} sm={24} md={16} lg={16}>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={1} />
          </Form.Item>
        </Col>
      </Row>

      <Table
        columns={columns}
        // dataSource={chargeOrderDetails}
        dataSource={chargeOrderDetails.filter((item) => !item.isDeleted)}
        rowKey="id"
        size="small"
        scroll={{ x: 'calc(100% - 200px)' }}
        pagination={false}
        sticky={{
          offsetHeader: 56
        }}
        // rowClassName={getRowClassName}
      />

      <div className="rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
        <Row gutter={[12, 12]}>
          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Total Quantity:"
              value={formatThreeDigitCommas(roundUpto(totalQuantity)) || 0}
            />
          </Col>

          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Total Amount:"
              value={formatThreeDigitCommas(roundUpto(totalAmount)) || 0}
            />
          </Col>

          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Discount Amount:"
              value={formatThreeDigitCommas(roundUpto(discountAmount)) || 0}
            />
          </Col>

          <Col span={24} sm={12} md={6} lg={6}>
            <DetailSummaryInfo
              title="Net Amount:"
              value={formatThreeDigitCommas(roundUpto(totalNet)) || 0}
            />
          </Col>
        </Row>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Link to="/charge-order">
          <Button className="w-28">Cancel</Button>
        </Link>

        {mode === 'edit' ? (
          <>
            {permissions.picklist.add ? (
              <Button
                type="primary"
                loading={isFormSubmitting === 'CREATE_PICK_LIST'}
                className="w-28 bg-slate-600 hover:!bg-slate-500"
                onClick={() => (isFormSubmitting ? null : onFinish('CREATE_PICK_LIST'))}>
                Pick List
              </Button>
            ) : null}

            {permissions.servicelist.add ? (
              <Button
                type="primary"
                loading={isFormSubmitting === 'CREATE_SERVICE_LIST'}
                className="w-28 bg-slate-600 hover:!bg-slate-500"
                onClick={() => (isFormSubmitting ? null : onFinish('CREATE_SERVICE_LIST'))}>
                Service List
              </Button>
            ) : null}

            {permissions.purchase_order.add ? (
              <Button
                type="primary"
                loading={isFormSubmitting === 'CREATE_PO' && !poChargeID}
                onClick={() => (isFormSubmitting ? null : onFinish('CREATE_PO'))}>
                Save & Create PO
              </Button>
            ) : null}
          </>
        ) : null}

        <Button
          type="primary"
          className="w-28"
          // loading={isFormSubmitting === true}
          loading={isFormSubmitting}
          onClick={() => (isFormSubmitting ? null : onFinish())}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ChargeOrderForm;
