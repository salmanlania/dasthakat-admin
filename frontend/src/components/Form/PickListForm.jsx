/* eslint-disable react/prop-types */
import { Button, Col, DatePicker, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import ReturnModal from '../Modals/PickListReturnModal'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import useError from '../../hooks/useError';
import AsyncSelect from '../AsyncSelect';
import DebouncedCommaSeparatedInput from '../Input/DebouncedCommaSeparatedInput';
import DebounceInput from '../Input/DebounceInput';
import { DetailSummaryInfo } from './QuotationForm';

const PickListForm = ({ mode, onSubmit, onSave, onRefresh }) => {
    const [form] = Form.useForm();
    const handleError = useError();
    const { initialFormValues, pickListDetail } = useSelector(
        (state) => state.pickList
    );

    const [submitAction, setSubmitAction] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [returnModalVisible, setReturnModalVisible] = useState(false);

    useEffect(() => {
        if (initialFormValues) {
            try {
                const salesmanId = initialFormValues?.salesman || '';
                const quantity = initialFormValues?.totalQuantity || 0;
                const amount = initialFormValues?.totalAmount || '';
                const customerPoNo = initialFormValues?.customer_po_no || '';
                const eventName = initialFormValues?.event_id || '';
                const vesselName = initialFormValues?.vessel_id || '';
                const customerName = initialFormValues?.customer || '';
                const portName = initialFormValues?.port_id || '';
                const refDocumentIdentity = initialFormValues?.ref_document_identity || '';
                const chargeOrderNo = initialFormValues?.charger_order_id || '';
                const billingAddress = initialFormValues?.billing_address || '';

                const documentDate = initialFormValues.document_date
                    ? dayjs(initialFormValues.document_date)
                    : null;

                const requiredDate = initialFormValues.required_date
                    ? dayjs(initialFormValues.required_date)
                    : null;

                form.setFieldsValue({
                    salesman_id: salesmanId,
                    totalQuantity: quantity,
                    totalAmount: amount,
                    customer_po_no: customerPoNo,
                    event_id: eventName,
                    vessel_id: vesselName,
                    customer_id: customerName,
                    charger_order_id: chargeOrderNo,
                    port_id: portName,
                    billing_address: billingAddress,
                    ref_document_identity: refDocumentIdentity,
                    document_date: documentDate,
                    required_date: requiredDate
                });
            } catch (error) {
                handleError(error)
            }
        }
    }, [initialFormValues, form, mode]);

    const POType = Form.useWatch('type', form);
    const isBuyout = POType === 'Buyout';

    const { user } = useSelector((state) => state.auth);
    const permissions = user.permission;

    let totalAmount = 0;
    let totalQuantity = 0;

    pickListDetail.forEach((detail) => {
        totalAmount += +detail.amount || 0;
        totalQuantity += +detail.quantity || 0;
    });

    const onFinish = (values) => {
        if (!totalAmount) return toast.error('Total Amount cannot be zero');

        const edit = mode;
        const deletedDetails = pickListDetail.filter((detail) => detail.isDeleted !== true);

        const filteredDetails = pickListDetail.filter(
            (detail) => !(detail.isDeleted && detail.row_status === 'I')
        );

        const mappingSource = edit === 'edit' ? pickListDetail : deletedDetails;

        const data = {
            type: values.type,
            remarks: values.remarks,
            ship_to: values.ship_to,
            buyer_name: values.buyer_name,
            yer_email: values.buyer_email,
            ship_via: values.ship_via,
            supplier_id: values.supplier_id ? values.supplier_id.value : null,
            class1_id: values.class1_id ? values.class1_id.value : null,
            buyer_id: values.buyer_id ? values.buyer_id.value : null,
            payment_id: values.payment_id ? values.payment_id.value : null,
            quotation_id: initialFormValues?.quotation_id,
            charge_order_id: initialFormValues?.charge_order_id,
            document_date: values.document_date ? dayjs(values.document_date).format('YYYY-MM-DD') : null,
            required_date: values.required_date ? dayjs(values.required_date).format('YYYY-MM-DD') : null,
            purchase_order_detail: mappingSource.map(
                ({ id, isDeleted, row_status, ...detail }, index) => ({
                    ...detail,
                    product_id: detail.product_type_id?.value == 4 ? null : detail.product_id.value,
                    product_name: detail.product_type_id?.value == 4 ? detail.product_name : null,
                    unit_id: detail.unit_id ? detail.unit_id.value : null,
                    product_type_id: detail.product_type_id ? detail.product_type_id.value : null,
                    sort_order: index,
                    purchase_order_detail_id: id ? id : null,
                    ...(edit === 'edit' ? { row_status } : {})
                })
            ),
            total_amount: totalAmount,
            total_quantity: totalQuantity
        };
        submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
    };

    const columns = [
        {
            title: 'Sr.',
            dataIndex: 'sr',
            key: 'sr',
            width: 50
        },
        {
            title: 'Product Type',
            dataIndex: 'product_type',
            key: 'product_type',
            render: (_, { product_type, product_type_id }, index) => {
                return (
                    <DebounceInput
                        value={product_type}
                        disabled={true}
                    />
                );
            },
            width: 120
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            render: (_, { product_name, product_type_id }, index) => {
                return (
                    <DebounceInput
                        value={product_name}
                        disabled={true}
                    />
                );
            },
            width: 220
        },
        {
            title: 'Description',
            dataIndex: 'product_description',
            key: 'product_description',
            render: (_, { product_description, product_type_id }, index) => {
                return (
                    <DebounceInput
                        value={product_description}
                        disabled={true}
                    />
                );
            },
            width: 220
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
                return (
                    <DebouncedCommaSeparatedInput
                        decimalPlaces={2}
                        value={newQuantity}
                        disabled={true}
                    />
                );
            },
            width: 100
        },
        {
            title: 'Return Quantity',
            dataIndex: 'returned_quantity',
            key: 'returned_quantity',
            render: (_, { returned_quantity }, index) => {
                const newQuantity = Number(returned_quantity)
                    .toString()
                    .replace(/(\.\d*?)0+$/, '$1')
                    .replace(/\.$/, '');
                return (
                    <DebouncedCommaSeparatedInput
                        decimalPlaces={2}
                        value={newQuantity || 0}
                        disabled={true}
                    />
                );
            },
            width: 100
        },
        {
            title: 'Unit Price',
            dataIndex: 'sale_price',
            key: 'sale_price',
            render: (_, { sale_price }, index) => {
                return (
                    <DebouncedCommaSeparatedInput
                        value={sale_price}
                        disabled={true}
                    />
                );
            },
            width: 120
        },
        {
            title: 'Cost Price',
            dataIndex: 'cost_price',
            key: 'cost_price',
            render: (_, { cost_price }) => (
                <DebouncedCommaSeparatedInput value={cost_price} disabled />
            ),
            width: 120
        },
    ];

    return (
        <>
            <Form
                name="purchaseOrder"
                layout="vertical"
                autoComplete="off"
                form={form}
                onFinish={onFinish}
                scrollToFirstError={{
                    behavior: 'smooth',
                    block: 'center',
                    scrollMode: 'always'
                }}>
                {/* Make this sticky */}
                <p className="sticky top-14 z-10 m-auto -mt-8 w-fit rounded border bg-white p-1 px-2 text-base font-semibold">
                    <span className="text-gray-500">Pick List No:</span>
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

                <Row gutter={12}>
                    <Col span={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="document_date"
                            label="Sale Invoice Date"
                            disabled
                        >
                            <DatePicker format="MM-DD-YYYY" className="w-full" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={5} lg={5}>
                        <Form.Item name="customer_po_no" label="Customer PO No">
                            <Input disabled />
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
                                disabled
                                labelInValue
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={6} lg={6}>
                        <Form.Item name="event_id" label="Event">
                            <AsyncSelect
                                endpoint="/event"
                                valueKey="event_id"
                                disabled
                                labelKey="event_name"
                                labelInValue
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={6} lg={6}>
                        <Form.Item name="vessel_id" label="Vessel">
                            <Select labelInValue disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={6} lg={6}>
                        <Form.Item name="charger_order_id" label="Charge Order No">
                            <Select labelInValue disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={6} lg={6}>
                        <Form.Item name="customer_id" label="Customer">
                            <Select labelInValue disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={6} lg={6}>
                        <Form.Item name="port_id" label="Port">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24} sm={12} md={5} lg={5}>
                        <Form.Item name="billing_address" label="Vessel Billing Address">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={
                        mode === 'edit'
                            ? pickListDetail.filter((item) => !item.isDeleted)
                            : pickListDetail
                    }
                    rowKey={(record) => record.id}
                    size="small"
                    scroll={{ x: 'calc(100% - 200px)' }}
                    pagination={false}
                    sticky={{
                        offsetHeader: 56
                    }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (newSelectedRowKeys, newSelectedRows) => {
                            setSelectedRowKeys(newSelectedRowKeys);
                            setSelectedRows(newSelectedRows);
                        }
                    }}
                />

                <div className="mt-4 flex items-center justify-end gap-2">
                    <Link to="/pick-list">
                        <Button className="w-28">Exit</Button>
                    </Link>
                    <Button
                        className="w-28 bg-amber-500 text-white hover:!bg-amber-400"
                        type="primary"
                        disabled={selectedRows.length === 0}
                        onClick={() => setReturnModalVisible(true)}
                    >
                        Return
                    </Button>
                </div>
            </Form>
            <ReturnModal
                visible={returnModalVisible}
                onClose={() => {
                    setReturnModalVisible(false)
                }}
                data={selectedRows}
                onRefresh={onRefresh}
            />
        </>
    );
};

export default PickListForm;
