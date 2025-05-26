import { useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Table,
  Tooltip
} from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { IoIosWarning, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import useError from '../../hooks/useError';
import NotesModal from '../../components/Modals/NotesModal.jsx';
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
const ChargeOrderForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, chargeOrderDetails } = useSelector(
    (state) => state.chargeOrder
  );

  chargeOrderDetails.forEach((item, index) => {
    form.setFieldsValue({
      [`product_description-${index}`]: item.product_description,
      [`product_id-${index}`]: item.product_id,
      [`product_name-${index}`]: item.product_name,
      [`quantity-${index}`]: item.quantity,
      [`rate-${index}`]: item.rate,
      [`discount_percent-${index}`]: item.discount_percent
    });
  });

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

  const onFinish = async (submitType = null, additionalRequest = null) => {
    setSubmitAction(submitType);
    const isValidFields = await form.validateFields();
    if (!isValidFields) return;
    const values = form.getFieldsValue();

    const edit = mode;
    const deletedDetails = chargeOrderDetails.filter((detail) => detail.isDeleted !== true);

    const filteredDetails = chargeOrderDetails.filter(
      (detail) => !(detail.isDeleted && detail.row_status === 'I')
    );

    const mappingSource = edit === 'edit' ? chargeOrderDetails : deletedDetails;

    const data = {
      chargeOrder_id,
      remarks: values.remarks,
      customer_po_no: values.customer_po_no,
      ref_document_identity: values.ref_document_identity,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      class1_id: values.class1_id ? values.class1_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      port_id: values.port_id ? values.port_id.value : null,
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
      technician_id: values.technician_id ? values.technician_id.map((v) => v.value) : null,
      charge_order_detail: mappingSource.map(
        ({ id, isDeleted, row_status, product_type, ...detail }, index) => {
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
            charge_order_detail_id: id ? id : null,
            ...(edit === 'edit' ? { row_status } : {})
          };
        }
      ),
      total_quantity: totalQuantity,
      is_event_changed: isEventChanged
    };

    submitType === 'save' ? onSubmit(data, additionalRequest) : submitType === 'saveAndExit' ? onSave(data, additionalRequest) : null;

    // if (submitAction === 'save') {
    //   onSubmit(data, additionalRequest)
    // }

    // if (submitAction === 'saveAndExit') {
    //   onSave(data, additionalRequest)
    // }
    if (additionalRequest === 'CREATE_PO') {
      dispatch(setChargePoID(id));
    }
  };

  const closeNotesModal = () => {
    setNotesModalIsOpen({ open: false, id: null, column: null, notes: null });
  };

  const onNotesSave = ({ notes }) => {
    const index = notesModalIsOpen.id;
    const column = notesModalIsOpen.column;

    dispatch(
      changeChargeOrderDetailValue({
        index,
        key: column,
        value: notes
      })
    );

    closeNotesModal();
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
  const [isEventChanged, setIsEventChanged] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [submitAction, setSubmitAction] = useState(null);
  const [notesModalIsOpen, setNotesModalIsOpen] = useState({
    open: false,
    id: null,
    column: null,
    notes: null
  });

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
    if (trimmed === '' && trimmed !== '0') return;

    const value = Number(trimmed);
    if (!isNaN(value)) {
      const filteredDetails = chargeOrderDetails.filter(item => !item.isDeleted);
      filteredDetails.forEach((row, filteredIndex) => {
        const index = chargeOrderDetails.findIndex(item => item.id === row.id);
        if (row.product_type_id?.value === 1) {
          dispatch(changeChargeOrderDetailValue({
            index,
            key: 'markup',
            value: 0
          }));
        } else {
          dispatch(changeChargeOrderDetailValue({
            index,
            key: 'markup',
            value
          }));
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
      width: 50,
      fixed: 'left'
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
      fixed: 'left'
    },
    {
      title: 'P.Type',
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
            value={
              product_type_id?.value
                ? {
                  value: product_type_id.value,
                  label: product_type_id.label?.slice(0, 2) || ''
                }
                : product_type_id
            }
            getOptionLabel={(item) => item.name?.slice(0, 2)}
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
      width: 70,
      fixed: 'left'
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (_, { product_id, product_name, product_type_id }, index) => {
        form.setFieldsValue({ [`product_name-${index}`]: product_name });
        form.setFieldsValue({ [`product_id-${index}`]: product_id });
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
              disabled={product_type_id?.value === 4}
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
              dropdownStyle={{ backgroundColor: '#ebedf7' }}
              optionLabelProp="children"
              optionProps={{ style: { backgroundColor: '#f5f5f5', whiteSpace: 'nowrap' } }}
            />
          </Form.Item>
        );
      },
      width: 130,
      fixed: 'left'
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      render: (_, { product_description, product_type_id }, index) => {
        form.setFieldsValue({ [`product_description-${index}`]: product_description });
        return (
          <Tooltip title={product_description || ''}>
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
                onChange={(value) => {
                  dispatch(
                    changeChargeOrderDetailValue({
                      index,
                      key: 'product_description',
                      value: value
                    })
                  );

                  if (product_type_id?.value === 4) {
                    dispatch(
                      changeChargeOrderDetailValue({
                        index,
                        key: 'product_name',
                        value: value
                      })
                    );

                    form.setFieldsValue({
                      [`product_name-${index}`]: value
                    });
                  }
                }}
              />
            </Form.Item>
          </Tooltip>
        );
      },
      width: 270,
      fixed: 'left'
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      render: (_, { description, editable }, index) => {
        return (
          <div className="relative">
            <p>{description}</p>
            <div
              className={`absolute -right-2 ${description?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
              <TbEdit
                size={22}
                className="text-primary hover:text-blue-600"
                onClick={() =>
                  setNotesModalIsOpen({
                    open: true,
                    id: index,
                    column: 'description',
                    notes: description
                  })
                }
              />
            </div>
          </div>
        );
      },
      width: 100
    },
    {
      title: 'Internal Notes',
      dataIndex: 'internal_notes',
      key: 'internal_notes',
      render: (_, { internal_notes }, index) => {
        return (
          <div className="relative">
            <p>{internal_notes}</p>
            <div
              className={`absolute -right-2 ${internal_notes?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
              <TbEdit
                size={22}
                className="text-primary hover:text-blue-600"
                onClick={() =>
                  setNotesModalIsOpen({
                    open: true,
                    id: index,
                    column: 'internal_notes',
                    notes: internal_notes
                  })
                }
              />
            </div>
          </div>
        );
      },
      width: 100
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      render: (_, { stock_quantity }) => {
        return <Input value={stock_quantity} disabled />;
      },
      width: 100
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
        const newQuantity = Number(quantity)
          .toString()
          .replace(/(\.\d*?)0+$/, '$1')
          .replace(/\.$/, '');
        form.setFieldsValue({ [`quantity-${index}`]: newQuantity });
        return (
          <div className="relative">
            <Form.Item
              className="m-0"
              name={`quantity-${index}`}
              initialValue={newQuantity}
              rules={[
                {
                  required: true,
                  message: 'Quantity is required'
                },
                {
                  validator: (_, value, callback, source) => {
                    const parsed = parseFloat(value?.toString().replace(/,/g, ''));
                    const receivedQty = chargeOrderDetails[index]?.picked_quantity || 0;
                    if (parsed < receivedQty) {
                      return Promise.reject(`Less Than Received Quantity (${receivedQty})`);
                    }
                    return Promise.resolve();
                  }
                }
              ]}>
              <DebouncedCommaSeparatedInput
                decimalPlaces={2}
                value={newQuantity}
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
      width: 90
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
      width: 100
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
      width: 100
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
        const newMarkup = Number(markup)
          .toString()
          .replace(/(\.\d*?)0+$/, '$1')
          .replace(/\.$/, '');
        return (
          <DebouncedNumberInput
            value={product_type_id?.value == 1 ? 0 : markup}
            type="decimal"
            disabled={product_type_id?.value == 1 || product_type === 'Service'}
            onChange={(value) => {
              dispatch(
                changeChargeOrderDetailValue({
                  index,
                  key: 'markup',
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
      width: 100
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} disabled />
      ),
      width: 100
    },
    {
      title: (
        <div className="flex flex-wrap">
          <span>Dis %</span>
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
      width: 80
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

    setIsEventChanged(true);

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
    <>
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
        <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-base font-semibold">
          <span className="text-gray-500">Charge order No:</span>
          <span
            className={`ml-4 text-amber-600 ${mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : 'select-none'
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
          <Col span={24} sm={12} md={6} lg={6}>
            <Form.Item name="customer_po_no" label="Customer PO No">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={5} lg={5}>
            <Form.Item name="ref_document_identity" label="Quote No">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={5} lg={5}>
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

          <Col span={24} sm={12} md={6} lg={6}>
            <Form.Item name="class1_id" label="Class 1">
              <Select labelInValue disabled />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={6} lg={6}>
            <Form.Item name="class2_id" label="Class 2">
              <Select labelInValue disabled />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="port_id"
              label="Port"
              initialValue={
                initialFormValues?.port_id && initialFormValues?.name
                  ? { value: initialFormValues.port_id, label: initialFormValues.name }
                  : null
              }>
              <AsyncSelect endpoint="/port" valueKey="port_id" labelKey="name" labelInValue />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={6} lg={6}>
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
            <Form.Item name="technician_id" label="Technician">
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
          {/* <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="agent_notes" label="Agent Notes">
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col> */}
          <Col span={24} sm={24} md={24} lg={24}>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col>
        </Row>

        <Table
          columns={columns}
          // dataSource={chargeOrderDetails.filter((item) => !item.isDeleted)}
          dataSource={chargeOrderDetails}
          rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
          rowKey="id"
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={false}
          sticky={{
            offsetHeader: 56
          }}
        />

        <div className="rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
          <Row gutter={[12, 12]}>
            <Col span={24} sm={12} md={6} lg={6}>
              <DetailSummaryInfo
                title="Total Quantity:"
                value={formatThreeDigitCommas(roundUpto(totalQuantity)) || 0}
              />
              <DetailSummaryInfo
                title="Total Amount:"
                value={formatThreeDigitCommas(roundUpto(totalAmount)) || 0}
              />
              <DetailSummaryInfo
                title="Discount Amount:"
                value={formatThreeDigitCommas(roundUpto(discountAmount)) || 0}
              />
              <DetailSummaryInfo
                title="Net Amount:"
                value={formatThreeDigitCommas(roundUpto(totalNet)) || 0}
              />
            </Col>
          </Row>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <Link to="/charge-order">
            <Button className="w-28">Exit</Button>
          </Link>

          {mode === 'edit' ? (
            <>
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
            loading={isFormSubmitting && submitAction === 'save'}
            onClick={() => {
              onFinish('save');
              // setSubmitAction('save');
              // (isFormSubmitting ? null : isFormSubmitting)
            }}>
            Save
          </Button>
          <Button
            type="primary"
            className="w-28 bg-green-600 hover:!bg-green-500"
            loading={isFormSubmitting && submitAction === 'saveAndExit'}
            onClick={() => {
              onFinish('saveAndExit');
              // setSubmitAction('saveAndExit');
              // (isFormSubmitting ? null : onFinish())
            }}>
            Save & Exit
          </Button>
        </div>
      </Form>
      <NotesModal
        title={notesModalIsOpen.column === 'description' ? 'Customer Notes' : 'Internal Notes'}
        initialValue={notesModalIsOpen.notes}
        isSubmitting={false}
        open={notesModalIsOpen.open}
        onCancel={closeNotesModal}
        onSubmit={onNotesSave}
        disabled={!permissions?.charge_order?.edit || !permissions?.charge_order?.add}
      />
    </>
  );
};

export default ChargeOrderForm;
