/* eslint-disable react/prop-types */
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEye } from 'react-icons/fa';
import { IoIosWarning, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { TbEdit } from 'react-icons/tb';
import { TiDelete } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import NotesModal from '../../components/Modals/NotesModal.jsx';
import useError from '../../hooks/useError';
import { getEvent, resetCommissionAgent } from '../../store/features/eventSlice';
import { getProduct } from '../../store/features/productSlice';
import {
  addQuotationDetail,
  changeQuotationDetailOrder,
  changeQuotationDetailValue,
  copyQuotationDetail,
  getQuotation,
  getQuotationForPrint,
  removeQuotationDetail,
  resetQuotationDetail,
  setRebatePercentage,
  setSalesmanPercentage,
  setTotalCommissionAmount,
  setVendorModalOpen,
  splitQuotationQuantity
} from '../../store/features/quotationSlice';
import { getSalesman } from '../../store/features/salesmanSlice';
import generateQuotationExcel from '../../utils/excel/quotation-excel.js';
import { formatThreeDigitCommas, roundUpto } from '../../utils/number';
import { createQuotationPrint } from '../../utils/prints/quotation-print';
import toastConfirm from '../../utils/toastConfirm';
import AsyncSelect from '../AsyncSelect';
import AsyncSelectNoPaginate from '../AsyncSelect/AsyncSelectNoPaginate.jsx';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebouncedNumberInput from '../Input/DebouncedNumberInput';
import DebounceInput from '../Input/DebounceInput';

import VendorSelectionModal from '../Modals/VendorSelectionModal.jsx';

export const DetailSummaryInfo = ({ title, value }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="ml-1 text-sm font-bold" style={{ color: 'black !important' }}>
        {title}
      </span>
      <span className="ml-1 text-sm text-gray-500">{value}</span>
    </div>
  );
};

export const DetailSummaryInformation = ({ title, value, icon }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="ml-1 text-sm font-bold" style={{ color: 'black !important' }}>
        {title}
      </span>
      <div className='flex items-center'>
        <span className="ml-1 text-sm text-gray-500">{value}</span>
        {icon && <span className="ml-[0.25rem] mr-[-1.1rem] cursor-pointer">{icon}</span>}
      </div>
    </div>
  );
};

export const DetailSummary = ({ title, value }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="ml-4 text-sm font-bold" style={{ color: 'black !important' }}>
        {title}
      </span>
      <span className="ml-4 text-sm text-gray-500">{value}</span>
    </div>
  );
};

export const DetailSummaryGp = ({ title, value }) => {
  return (
    <div className="flex items-center justify-between gap-2 ml-[9px]">
      <span className="ml-4 text-sm font-bold" style={{ color: 'black !important' }}>
        {title}
      </span>
      <span className="ml-4 text-sm text-gray-500">{value}</span>
    </div>
  );
};

export const quotationStatusOptions = [
  {
    value: 'In Progress',
    label: 'In Progress',
  },
  {
    value: 'Ready to Review',
    label: 'Ready to Review',
  },
  {
    value: 'Approved',
    label: 'Approved',
  },
  {
    value: 'Sent to customer',
    label: 'Sent to customer',
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
  },
];

const QuotationForm = ({ mode, onSubmit, onSave, onVendor }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    isFormSubmitting,
    totalCommissionAmount,
    initialFormValues,
    quotationDetails,
    rebatePercentage,
    salesmanPercentage,
    commissionAgentData,
    isVendorModalOpen
  } = useSelector((state) => state.quotation);
  const { commissionAgent } = useSelector((state) => state.event);
  const [prevEvent, setPrevEvent] = useState(initialFormValues?.event_id);

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission;
  const [notesModalIsOpen, setNotesModalIsOpen] = useState({
    open: false,
    id: null,
    column: null,
    notes: null,
  });

  const notesTitleMap = {
    description: 'Customer Notes',
    vendor_notes: 'Vendor Notes',
    internal_notes: 'Internal Notes',
  };

  const [globalMarkup, setGlobalMarkup] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [isLoadingVendor, setIsLoadingVendor] = useState(false);
  const [submitAction, setSubmitAction] = useState(null);
  const [hiddenAgentKeys, setHiddenAgentKeys] = useState([]);
  const [isCommissionTableVisible, setIsCommissionTableVisible] = useState(false);
  let totalQuantity = 0;
  let totalCost = 0;
  let totalAmount = 0;
  let discountAmount = 0;
  let totalNet = 0;
  let totalProfit = 0;
  let typeId = 0;
  let gp = 0;

  quotationDetails.forEach((detail) => {
    typeId = detail?.product_type_id?.value;
    totalQuantity += +detail.quantity || 0;
    if (typeId !== 1) {
      totalCost += (+detail.quantity || 0) * (+detail.cost_price || 0);
    }
    totalAmount += +detail.amount || 0;
    discountAmount += +detail.discount_amount || 0;
    totalNet += +detail.gross_amount || 0;
  });

  const parsedRebate = parseFloat(rebatePercentage) || 0;
  const parsedSalesman = parseFloat(salesmanPercentage) || 0;

  const rebateAmount = totalNet
    ? formatThreeDigitCommas(roundUpto(totalNet * (parsedRebate / 100)))
    : 0;

  const salesmanAmount = totalNet
    ? formatThreeDigitCommas(roundUpto(totalNet * (parsedSalesman / 100)))
    : 0;

  const minusValue =
    parseInt(rebateAmount?.toString().replace(/,/g, '') || 0) +
    parseInt(salesmanAmount?.toString().replace(/,/g, '') || 0) +
    parseInt(totalCost || 0) +
    parseInt(totalCommissionAmount || 0);

  const finalAmount = parseInt(totalNet || 0) - minusValue || 0;
  totalProfit = roundUpto(finalAmount - totalCost);

  quotationDetails.forEach((detail) => {
    gp = finalAmount * 100 / totalNet
  });

  useEffect(() => {
    const activeAgents =
      commissionAgent?.length > 0 ? commissionAgent : commissionAgentData;

    if (activeAgents?.length > 0 && totalNet) {
      const totalAmount = activeAgents
        .filter((agent) => !hiddenAgentKeys.includes(agent.commission_agent_id))
        .reduce((sum, agent) => {
          const percentage = parseFloat(agent.commission_percentage || 0);
          const amount = roundUpto((percentage * totalNet) / 100);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
      dispatch(setTotalCommissionAmount(totalAmount));
    } else {
      dispatch(setTotalCommissionAmount(0));
    }
  }, [commissionAgent, commissionAgentData, totalNet, hiddenAgentKeys, dispatch]);

  const onFinish = (values) => {
    const checkCommission = commissionAgentData?.length > 0 ? commissionAgentData : commissionAgent;
    const selectedCommissionAgents = checkCommission
      .filter((agent) => !hiddenAgentKeys.includes(agent.commission_agent_id))
      .map((agent) => {
        const percentage = parseFloat(agent?.commission_percentage || 0);
        const amount = roundUpto((percentage * totalNet) / 100);
        return {
          vessel_id: agent.vessel_id || null,
          customer_id: agent.customer_id || null,
          commission_agent_id: agent.commission_agent_id,
          percentage,
          amount,
          isDeleted: false,
          sort_order: 1,
        };
      });

    if (rebatePercentage > 100) return toast.error('Rebate Percentage cannot be greater than 100');
    if (salesmanPercentage > 100)
      return toast.error('Salesman Percentage cannot be greater than 100');
    const edit = mode;
    const deletedDetails = quotationDetails.filter((detail) => detail.isDeleted !== true);

    const filteredDetails = quotationDetails.filter(
      (detail) => !(detail.isDeleted && detail.row_status === 'I'),
    );

    const mappingSource = edit === 'edit' ? quotationDetails : deletedDetails;

    const data = {
      attn: values.attn,
      delivery: values.delivery,
      customer_ref: values.customer_ref,
      imo: values.imo,
      internal_notes: values.internal_notes,
      term_desc: values.term_desc,
      class1_id: values.class1_id ? values.class1_id.value : null,
      port_id: values.port_id ? values.port_id.value : null,
      class2_id: values.class2_id ? values.class2_id.value : null,
      customer_id: values.customer_id ? values.customer_id.value : null,
      event_id: values.event_id ? values.event_id.value : null,
      flag_id: values.flag_id ? values.flag_id.value : null,
      person_incharge_id: values.person_incharge_id ? values.person_incharge_id.value : null,
      payment_id: values.payment_id ? values.payment_id.value : null,
      salesman_id: values.salesman_id ? values.salesman_id.value : null,
      validity_id: values.validity_id ? values.validity_id.value : null,
      vessel_id: values.vessel_id ? values.vessel_id.value : null,
      document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
      service_date: values.service_date ? dayjs(values.service_date).format('YYYY-MM-DD') : '',
      due_date: values.due_date ? dayjs(values.due_date).format('YYYY-MM-DD') : '',
      term_id: values.term_id && values.term_id.length ? values.term_id.map((v) => v.value) : null,
      status: values.status,
      remarks: values.remarks,
      commission_agent: selectedCommissionAgents,
      quotation_detail: mappingSource.map(
        ({ id, row_status, isDeleted, product_type, ...detail }, index) => {
          return {
            ...detail,
            product_id: detail.product_type_id?.value == 4 ? null : detail?.product_id?.value,
            product_name: detail?.product_name ? detail?.product_name : null,
            supplier_id: detail.supplier_id ? detail?.supplier_id?.value : null,
            product_type_id: detail?.product_type_id ? detail?.product_type_id?.value : null,
            unit_id: detail?.unit_id ? detail?.unit_id?.value : null,
            markup: detail.product_type_id?.value === 1 ? 0 : detail.markup,
            cost_price: detail.product_type_id?.value === 1 ? 0 : detail.cost_price,
            sort_order: index,
            quotation_detail_id: id ? id : null,
            ...(edit === 'edit' ? { row_status } : {}),
          };
        },
      ),
      total_quantity: totalQuantity,
      total_Cost: totalCost,
      total_discount: discountAmount,
      total_amount: totalAmount,
      net_amount: totalNet,
      rebate_percent: rebatePercentage,
      salesman_percent: salesmanPercentage,
      rebate_amount: rebateAmount,
      salesman_amount: salesmanAmount,
    };

    submitAction === 'save'
      ? onSubmit(data).then(() => dispatch(resetCommissionAgent()))
      : submitAction === 'saveAndExit'
        ? onSave(data).then(() => dispatch(resetCommissionAgent()))
        : submitAction === 'rfq'
          ? (setIsLoadingVendor(true),
            onVendor(data)
              .then(async () => {
                try {
                  await dispatch(getQuotation(id)).unwrap();
                  dispatch(setVendorModalOpen(true));
                } catch (error) {
                  handleError(error);
                } finally {
                  setIsLoadingVendor(false);
                }
              })
              .catch((error) => {
                handleError(error);
                setIsLoadingVendor(false);
              }))
          : null;
  };

  const closeNotesModal = () => {
    setNotesModalIsOpen({ open: false, id: null, column: null, notes: null });
  };

  const onNotesSave = ({ notes }) => {
    const index = notesModalIsOpen.id;
    const column = notesModalIsOpen.column;

    dispatch(
      changeQuotationDetailValue({
        index,
        key: column,
        value: notes,
      }),
    );

    closeNotesModal();
  };

  const onProductChange = async (index, selected) => {
    if (!selected) {
      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'product_code',
          value: null,
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'unit_id',
          value: null,
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'cost_price',
          value: null,
        }),
      );
      return;
    } else {
      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'rate',
          value: null,
        }),
      );
    }

    form.setFieldsValue({
      [`product_description-${index}`]: selected?.label || '',
    });

    dispatch(
      changeQuotationDetailValue({
        index,
        key: 'product_description',
        value: selected?.label || '',
      }),
    );
    form.setFieldsValue({
      [`product_name-${index}`]: selected?.label || '',
    });

    dispatch(
      changeQuotationDetailValue({
        index,
        key: 'product_name',
        value: selected?.label || '',
      }),
    );
    dispatch(
      changeQuotationDetailValue({
        index,
        key: 'product_id',
        value: selected || '',
      }),
    );

    try {
      const product = await dispatch(getProduct(selected.value)).unwrap();
      const stockQuantity = product?.stock?.quantity || 0;

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'product_code',
          value: product.product_code,
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'product_type_id',
          value: product.product_type_id
            ? {
              value: product.product_type_id,
              label: product.product_type_name,
            }
            : null,
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'unit_id',
          value: { value: product.unit_id, label: product.unit_name },
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'stock_quantity',
          value: stockQuantity,
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'cost_price',
          value: product.cost_price,
        }),
      );

      dispatch(
        changeQuotationDetailValue({
          index,
          key: 'rate',
          value: product.sale_price,
        }),
      );
    } catch (error) {
      handleError(error);
    }
  };

  const printQuotation = async () => {
    const loadingToast = toast.loading('Loading print...');
    try {
      const data = await dispatch(getQuotationForPrint(id)).unwrap();
      createQuotationPrint(data);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const exportQuotation = async () => {
    const loadingToast = toast.loading('Loading excel...');
    try {
      const data = await dispatch(getQuotationForPrint(id)).unwrap();
      generateQuotationExcel(data);
    } catch (error) {
      handleError(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const applyGlobalDiscount = (inputValue) => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      return;
    }
    const value = Number(trimmed);
    if (!isNaN(value)) {
      quotationDetails.forEach((row, index) => {
        dispatch(
          changeQuotationDetailValue({
            index,
            key: 'discount_percent',
            value: value,
          }),
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
      quotationDetails.forEach((row, index) => {
        if (row.product_type_id?.value === 1) {
          dispatch(
            changeQuotationDetailValue({
              index,
              key: 'markup',
              value: 0,
            }),
          );
        } else if (row.product_type_id?.value !== 1) {
          dispatch(
            changeQuotationDetailValue({
              index,
              key: 'markup',
              value: value,
            }),
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
          onClick={() => dispatch(addQuotationDetail())}
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
                dispatch(changeQuotationDetailOrder({ from: index, to: index - 1 }));
              }}
            />
            <Button
              className="h-4"
              size="small"
              icon={<IoMdArrowDropdown size={16} />}
              disabled={index === quotationDetails.length - 1}
              onClick={() => {
                dispatch(changeQuotationDetailOrder({ from: index, to: index + 1 }));
              }}
            />
          </div>
        );
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'P.Type',
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
            value={
              product_type_id?.value
                ? {
                  value: product_type_id.value,
                  label: product_type_id.label?.slice(0, 2) || '',
                }
                : product_type_id
            }
            getOptionLabel={(item) => item.name?.slice(0, 2)}
            onChange={(selected) => {
              dispatch(resetQuotationDetail(index));
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: 'product_type_id',
                  value: selected,
                }),
              );
            }}
          />
        );
      },
      width: 70,
      fixed: 'left',
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
            className="m-0"
            name={`product_name-${index}`}
            value={product_name}
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Product Name is required',
              },
            ]}>
            <DebounceInput
              value={product_name}
              disabled={product_type_id?.value === 4}
              onChange={(value) => {
                dispatch(
                  changeQuotationDetailValue({
                    index,
                    key: 'product_name',
                    value: value,
                  }),
                );

                form.setFieldsValue({
                  [`product_description-${index}`]: value,
                });
              }}
            />
          </Form.Item>
        ) : (
          <Form.Item
            className="m-0"
            name={`product_name-${index}`}
            value={product_id ? { value: product_id, label: product_name } : null}
            rules={[
              {
                required: true,
                message: 'Product Name is required',
              },
            ]}>
            <AsyncSelect
              endpoint="/product"
              valueKey="product_id"
              labelKey="product_name"
              labelInValue
              className="w-full"
              value={product_id ? { value: product_id, label: product_name } : null}
              onChange={(selected) => onProductChange(index, selected)}
              addNewLink={permissions.product.add ? '/product/create' : null}
              dropdownStyle={{ backgroundColor: '#a2e1eb' }}
              optionLabelProp="children"
              optionProps={{ style: { backgroundColor: '#a2e1eb', whiteSpace: 'nowrap' } }}
            />
          </Form.Item>
        );
      },
      width: 130,
      fixed: 'left',
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
                  message: 'Description is required',
                },
              ]}>
              <DebounceInput
                value={product_description}
                onChange={(value) => {
                  dispatch(
                    changeQuotationDetailValue({
                      index,
                      key: 'product_description',
                      value: value,
                    }),
                  );

                  if (product_type_id?.value === 4) {
                    dispatch(
                      changeQuotationDetailValue({
                        index,
                        key: 'product_name',
                        value: value,
                      }),
                    );
                    form.setFieldsValue({
                      [`product_name-${index}`]: value,
                    });
                  }
                }}
              />
            </Form.Item>
          </Tooltip>
        );
      },
      width: 270,
      fixed: 'left',
    },
    {
      title: 'Customer Notes',
      dataIndex: 'description',
      key: 'description',
      render: (_, { event_id, description }, index) => {
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
                    notes: description,
                  })
                }
              />
            </div>
          </div>
        );
      },
      width: 100,
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
                    notes: internal_notes,
                  })
                }
              />
            </div>
          </div>
        );
      },
      width: 100,
    },
    {
      title: 'Vendor Notes',
      dataIndex: 'vendor_notes',
      key: 'vendor_notes',
      render: (_, { vendor_notes }, index) => {
        return (
          <div className="relative">
            <p>{vendor_notes}</p>
            <div
              className={`absolute -right-2 ${vendor_notes?.trim() ? '-top-[2px]' : '-top-[12px]'} flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white`}>
              <TbEdit
                size={22}
                className="text-primary hover:text-blue-600"
                onClick={() =>
                  setNotesModalIsOpen({
                    open: true,
                    id: index,
                    column: 'vendor_notes',
                    notes: vendor_notes,
                  })
                }
              />
            </div>
          </div>
        );
      },
      width: 100,
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      render: (_, { stock_quantity }) => {
        return <Input value={stock_quantity} disabled />;
      },
      width: 100,
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
                  message: 'Quantity is required',
                },
                {
                  validator: (_, value, callback, source) => {
                    const parsed = parseFloat(value?.toString().replace(/,/g, ''));
                    const receivedQty = quotationDetails[index]?.picked_quantity || 0;

                    if (isNaN(parsed)) {
                      return Promise.reject('Invalid number');
                    }

                    if (parsed < receivedQty) {
                      return Promise.reject(`Less Than Received Quantity (${receivedQty})`);
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <DebouncedCommaSeparatedInput
                decimalPlaces={2}
                value={newQuantity}
                disabled={editable === false}
                onChange={(value) =>
                  dispatch(
                    changeQuotationDetailValue({
                      index,
                      key: 'quantity',
                      value: value,
                    }),
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
                        onClick={() => dispatch(splitQuotationQuantity(index))}>
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
      width: 90,
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
                changeQuotationDetailValue({
                  index,
                  key: 'unit_id',
                  value: selected,
                }),
              )
            }
            addNewLink={permissions.unit.list && permissions.unit.add ? '/unit' : null}
          />
        );
      },
      width: 100,
    },
    {
      title: 'Vendor',
      dataIndex: 'supplier_id',
      key: 'supplier_id',
      render: (_, { supplier_id, product_type_id }, index) => {
        return (
          <AsyncSelect
            endpoint="/supplier"
            valueKey="supplier_id"
            labelKey="name"
            labelInValue
            className="w-full"
            disabled={product_type_id?.value == 1 || product_type_id?.value == 2}
            value={supplier_id}
            onChange={(selected) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: 'supplier_id',
                  value: selected,
                }),
              )
            }
            addNewLink={permissions.supplier.add ? '/vendor/create' : null}
          />
        );
      },
      width: 240,
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
                changeQuotationDetailValue({
                  index,
                  key: 'vendor_part_no',
                  value: value,
                }),
              )
            }
          />
        );
      },
      width: 120,
    },
    {
      title: 'Cost Price',
      dataIndex: 'cost_price',
      key: 'cost_price',
      render: (_, { cost_price, product_type_id }, index) => {
        return (
          <DebouncedCommaSeparatedInput
            value={
              product_type_id?.value === 1
                ? '0'
                : cost_price === 0 || cost_price === '0'
                  ? '0'
                  : cost_price
                    ? `${Number(cost_price).toString().includes('.') && Number(cost_price) % 1 !== 0
                      ? Number(cost_price)
                        .toFixed(2)
                        .replace(/\.?0+$/, '')
                      : Number(cost_price)
                    }`
                    : ''
            }
            disabled={product_type_id?.value == 1}
            onChange={(value) =>
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: 'cost_price',
                  value: value,
                }),
              )
            }
          />
        );
      },
      width: 100,
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
              borderRadius: '4px',
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
            value={product_type_id?.value == 1 ? 0 : newMarkup}
            type="decimal"
            disabled={product_type_id?.value == 1 || product_type === 'Service'}
            onChange={(value) => {
              dispatch(
                changeQuotationDetailValue({
                  index,
                  key: 'markup',
                  value: value,
                }),
              );
            }}
          />
        );
      },
      width: 90,
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
            initialValue={rate || "0"}
            rules={[
              {
                required: true,
                message: 'Selling price is required',
              },
            ]}>
            <DebouncedCommaSeparatedInput
              value={rate || "0"}
              onChange={(value) => {
                dispatch(
                  changeQuotationDetailValue({
                    index,
                    key: 'rate',
                    value: value || "0",
                  }),
                );
              }}
            />
          </Form.Item>
        );
      },
      width: 100,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => (
        <DebouncedCommaSeparatedInput value={amount ? amount + '' : ''} disabled />
      ),
      width: 100,
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
              width: '60px',
              fontSize: '12px',
              padding: '2px 4px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
            }}
          />
        </div>
      ),
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      render: (_, { discount_percent }, index) => {
        form.setFieldsValue({
          [`discount_percent-${index}`]: discount_percent,
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
                },
              },
            ]}>
            <DebouncedNumberInput
              value={discount_percent}
              type="decimal"
              onChange={(value) =>
                dispatch(
                  changeQuotationDetailValue({
                    index,
                    key: 'discount_percent',
                    value: value,
                  }),
                )
              }
            />
          </Form.Item>
        );
      },
      width: 80,
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
      width: 120,
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
      width: 150,
    },
    {
      title: (
        <Button
          size="small"
          type="primary"
          className="!w-8"
          icon={<BiPlus size={14} />}
          onClick={() => dispatch(addQuotationDetail())}
        />
      ),
      key: 'action',
      render: (record, { id }, index) => {
        return (
          <Dropdown
            trigger={['click']}
            arrow
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Add',
                  onClick: () => dispatch(addQuotationDetail(index)),
                },
                {
                  key: '2',
                  label: 'Copy',
                  onClick: () => dispatch(copyQuotationDetail(index)),
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => dispatch(removeQuotationDetail(id)),
                },
              ],
            }}>
            <Button size="small">
              <BsThreeDotsVertical />
            </Button>
          </Dropdown>
        );
      },
      width: 50,
      fixed: 'right',
    },
  ];

  const commissionAgentColumns = [
    {
      title: 'Agent Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        if (record.isStatic) {
          return <span>{record.name}</span>;
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Agent {index + 1}
            {permissions?.quotation?.commission_agent && (
              <Tooltip title={text}>
                <FaEye size={14} style={{ cursor: 'pointer' }} />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: 'Percentage',
      key: 'commission_percentage',
      dataIndex: 'commission_percentage',
      render: (value) => `${value ?? 0}%`,
    },
    {
      title: 'Total Amount',
      key: 'amount',
      dataIndex: 'commission_percentage',
      render: (percentage, record, index) => {
        const safePercentage = parseFloat(percentage || 0);
        const safeTotalNet = totalNet || 0;
        const amount = roundUpto((safePercentage * safeTotalNet) / 100);
        return isNaN(amount) ? 0 : amount;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) =>
        record.isStatic ? null : (
          <Button
            danger
            size="small"
            style={{
              border: 'none',
              outline: 'none',
              background: 'none',
              boxShadow: 'none',
            }}
            onClick={() => {
              setHiddenAgentKeys((prev) => [...prev, record.commission_agent_id])
            }}
          >
            <TiDelete size={20} />
          </Button>
        ),
    },
  ];

  const extendedCommissionData = [
    ...(commissionAgent.length > 0 ? commissionAgent : commissionAgentData),
    {
      commission_agent_id: 'rebate_row',
      name: 'Rebate',
      commission_percentage: rebatePercentage,
      amount: rebateAmount,
      isStatic: true,
    },
    {
      commission_agent_id: 'salesman_row',
      name: 'Salesman',
      commission_percentage: salesmanPercentage,
      amount: salesmanAmount,
      isStatic: true,
    },
  ];

  const onTermChange = (selected) => {
    if (!selected.length) {
      form.setFieldsValue({ term_desc: '' });
      return;
    }

    const newTermDesc = selected.map((t) => `* ${t.label}`).join('\n');
    form.setFieldsValue({ term_desc: newTermDesc });
  };

  const onEventChange = async (selected) => {
    if (prevEvent) {
      const isWantToChange = await toastConfirm('Are you sure you want to change event?');
      if (!isWantToChange) {
        form.setFieldsValue({ event_id: prevEvent });
        return;
      }
    }

    form.setFieldsValue({
      vessel_id: null,
      customer_id: null,
      imo: null,
      class1_id: null,
      class2_id: null,
      flag_id: null,
      salesman_id: null,
    });
    dispatch(setRebatePercentage(null));
    setPrevEvent(selected);

    if (!selected) return;
    try {
      const data = await dispatch(getEvent(selected.value)).unwrap();
      form.setFieldsValue({
        vessel_id: { value: data.vessel_id, label: data.vessel_name },
        imo: data.imo,
        customer_id: { value: data.customer_id, label: data.customer_name },
        class1_id: { value: data.class1_id, label: data.class1_name },
        class2_id: { value: data.class2_id, label: data.class2_name },
        flag_id: { value: data.flag_id, label: data.flag_name },
        payment_id: { value: data.payment_id, label: data.payment_name },
        salesman_id: { value: data.salesman_id, label: data.salesman_name },
      });
      dispatch(setRebatePercentage(data.rebate_percent ? +data.rebate_percent : 0));
      dispatch(setSalesmanPercentage(data.commission_percentage ? +data.commission_percentage : 0));
    } catch (error) {
      handleError(error);
    }
  };

  const onSalesmanChange = async (selected) => {
    dispatch(setSalesmanPercentage(null));
    if (!selected) return;

    try {
      const data = await dispatch(getSalesman(selected.value)).unwrap();
      dispatch(setSalesmanPercentage(data.commission_percentage ? +data.commission_percentage : 0));
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Form
        name="quotation"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={
          mode === 'edit'
            ? {
              ...initialFormValues,
              document_date: initialFormValues.document_date
                ? dayjs(initialFormValues.document_date)
                : null,
              service_date:
                initialFormValues?.service_date === '0000-00-00' ||
                  initialFormValues?.service_date === '1899-30-11'
                  ? null
                  : dayjs(initialFormValues?.service_date),
              due_date:
                initialFormValues?.due_date === '0000-00-00' ||
                  initialFormValues?.due_date === '1899-30-11'
                  ? null
                  : dayjs(initialFormValues?.due_date),
            }
            : {
              document_date: dayjs(),
              due_date: dayjs(),
              status: 'In Progress',
            }
        }
        scrollToFirstError>
        {/* Make this sticky */}
        <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-base font-semibold">
          <span className="text-sm text-gray-500">Quotation No:</span>
          <span
            className={`ml-4 text-amber-600 ${mode === 'edit' ? 'cursor-pointer hover:bg-slate-200' : ''
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
              label="Quotation Date"
              rules={[{ required: true, message: 'Quotation date is required' }]}
              className="w-full">
              <DatePicker format="MM-DD-YYYY" className="w-full" disabled />
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
                onChange={onSalesmanChange}
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
            <Form.Item name="imo" label="IMO">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="customer_id" label="Customer">
              <Select labelInValue disabled />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8} className="flex items-center gap-3">
            <Form.Item name="class1_id" label="Class 1" className="w-full">
              <Select labelInValue disabled />
            </Form.Item>

            <Form.Item name="class2_id" label="Class 2" className="w-full">
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
            <Form.Item name="person_incharge_id" label="Person Incharge">
              <AsyncSelect
                endpoint="/user"
                valueKey="user_id"
                labelKey="user_name"
                labelInValue
                addNewLink={permissions.user.add ? '/user/create' : null}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="customer_ref" label="Customer Ref">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="due_date" label="Due Date" className="w-full">
              <DatePicker format="MM-DD-YYYY" className="w-full" />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="service_date" label="Date of Service" className="w-full">
              <DatePicker format="MM-DD-YYYY" className="w-full" />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="attn" label="Attn">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="delivery" label="Delivery">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="validity_id" label="Validity">
              <AsyncSelect
                endpoint="/validity"
                valueKey="validity_id"
                labelKey="name"
                labelInValue
                addNewLink={
                  permissions.validity.list && permissions.validity.add ? '/validity' : null
                }
                defaultFirstSelected
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
                defaultFirstSelected
                addNewLink={permissions.payment.list && permissions.payment.add ? '/payment' : null}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="port_id" label="Port">
              <AsyncSelect
                endpoint="/port"
                valueKey="port_id"
                labelKey="name"
                labelInValue
                addNewLink={permissions.port.list && permissions.port.add ? '/port' : null}
              />
            </Form.Item>
          </Col>

          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="status" label="Status">
              <Select options={quotationStatusOptions} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={1} />
            </Form.Item>
          </Col>
        </Row>

        <div className="rounded-lg border border-slate-300 bg-slate-50 p-4">
          <div className="flex flex-col items-center justify-between py-2 md:flex-row">
            <h5 className="text-base font-medium">Notes</h5>
            <Form.Item name="term_id" className="m-0 w-full p-0 md:w-96">
              <AsyncSelect
                endpoint="/terms"
                valueKey="term_id"
                labelKey="name"
                placeholder="Select Terms"
                labelInValue
                mode="multiple"
                maxTagCount="responsive"
                onChange={(selected) => onTermChange(selected)}
                addNewLink={permissions.terms.list && permissions.terms.add ? '/notes' : null}
              />
            </Form.Item>
          </div>

          <Form.Item name="term_desc" className="mb-3">
            <Input.TextArea
              autoSize={{
                minRows: 2,
              }}
              rows={2}
            />
          </Form.Item>
        </div>

        <Divider orientation="left" className="!border-gray-300">
          Quotation Items
        </Divider>

        <Table
          columns={columns}
          dataSource={quotationDetails}
          rowClassName={(record) => (record.isDeleted ? 'hidden-row' : '')}
          rowKey={'id'}
          size="small"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={false}
          sticky={{
            offsetHeader: 56,
          }}
        />

        <div className="rounded-lg rounded-t-none border border-t-0 border-slate-300 bg-slate-50 px-6 py-3">
          <div className="flex w-full gap-0 items-center flex-col md:flex-row">
            <div className="w-full md:w-[60%] flex-shrink-0 max-h-[300px] gap-5">
              <Row gutter={[12, 12]}>
                <Col span={24} sm={12} md={12} lg={12}>
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
                  <DetailSummaryInfo
                    title="Total Cost:"
                    value={formatThreeDigitCommas(roundUpto(totalCost)) || 0}
                  />

                  <DetailSummaryInformation
                    title="Other Commission:"
                    value={formatThreeDigitCommas(roundUpto(totalCommissionAmount)) || 0}
                    icon={
                      permissions?.quotation?.commission_agent && (
                        <FaEye
                          size={14}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setIsCommissionTableVisible(!isCommissionTableVisible)}
                        />
                      )
                    }
                  />
                  <DetailSummaryInfo title="Final Amount:" value={finalAmount} />
                </Col>
                <Row gutter={[12, 12]}>
                  <div className="flex flex-col gap-2 text-right justify-between">
                    <DetailSummary
                      title="Total Quantity:"
                      value={formatThreeDigitCommas(roundUpto(totalQuantity)) || 0}
                    />
                    <DetailSummaryGp
                      title="GP %:"
                      value={`${formatThreeDigitCommas(roundUpto(gp)) || 0}%`}
                    />
                  </div>
                </Row>
              </Row>
            </div>
            <div className="w-full md:w-[35%] mt-4 md:mt-0">
              {isCommissionTableVisible && (commissionAgent.length > 0 || commissionAgentData.length > 0) ? (
                <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="max-w-full">
                    <Table
                      columns={commissionAgentColumns}
                      // dataSource={commissionAgent.length > 0 ? commissionAgent : commissionAgentData}
                      dataSource={extendedCommissionData}
                      rowKey={(record) => record.commission_agent_id}
                      size="small"
                      pagination={false}
                      rowSelection={null}
                      rowClassName={(record) =>
                        hiddenAgentKeys.includes(record.commission_agent_id) ? 'hidden-row' : ''
                      }
                      className="comission-agent-quotation-custom-table"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/quotation">
            <Button className="w-28">Exit</Button>
          </Link>
          {mode === 'edit' ? (
            <>
              <Button
                type="primary"
                className="w-28 bg-rose-600 hover:!bg-rose-500"
                onClick={printQuotation}>
                Print
              </Button>

              <Button
                type="primary"
                className="w-28 bg-emerald-800 hover:!bg-emerald-700"
                onClick={exportQuotation}>
                Export
              </Button>
            </>
          ) : null}
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

          {mode === 'edit' && permissions?.vp_quotation?.add ?
            <Button onClick={() => {
              setSubmitAction('rfq');
              form.submit();
            }}>RFQ</Button> : ''}
        </div>
      </Form>
      <NotesModal
        // title={
        //   notesModalIsOpen.column === 'description'
        //     ? 'Customer Notes'
        //     : notesModalIsOpen.column === 'vendor_notes'
        //       ? 'Vendor Notes'
        //       : 'Internal Notes'
        // }
        title={notesTitleMap[notesModalIsOpen.column] || 'Notes'}
        initialValue={notesModalIsOpen.notes}
        isSubmitting={false}
        open={notesModalIsOpen.open}
        onCancel={closeNotesModal}
        onSubmit={onNotesSave}
        disabled={!permissions?.quotation?.edit || !permissions?.quotation?.add}
      />

      <VendorSelectionModal
        open={isVendorModalOpen}
        onClose={async () => {
          dispatch(setVendorModalOpen(false))
          try {
            await dispatch(getQuotation(id)).unwrap();
          } catch (error) {
            handleError(error)
          }
        }}
        loading={isLoadingVendor}
      />
    </>
  );
};

export default QuotationForm;