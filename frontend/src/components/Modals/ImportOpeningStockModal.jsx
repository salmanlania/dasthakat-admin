import { Modal, Button, Form, Input, Upload, Col, Row } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createImportOpeningStock } from '../../store/features/openingStockSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from '../AsyncSelect';
import useError from '../../hooks/useError';

const { Dragger } = Upload;

const ImportOpeningStockModal = ({ open, onClose, onUpload }) => {
    const [form] = Form.useForm();
    const [files, setFiles] = useState(null);
    const dispatch = useDispatch();
    const handleError = useError();

    const { user } = useSelector((state) => state.auth);
    const permissions = user.permission;

    const handleFileChange = ({ file }) => {
        const isValidType = ['.csv', '.xls', 'xlsx'].includes(file.name.split('.').pop());
        if (!isValidType) {
            toast.error('You can only upload CSV or Excel files!');
            setFiles(null);
        } else {
            setFiles(file);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (files) {
                const payload = {
                    excel_file: files,
                    remarks: values.remarks ? values.remarks : null,
                    warehouse_id: values.warehouse_id ? values.warehouse_id.value : null,
                };

                await dispatch(createImportOpeningStock(payload)).unwrap();

                form.resetFields();
                setFiles(null);
                onClose();
            } else {
                toast.error('Please upload a valid file.');
            }
        } catch (error) {
            handleError(error)
        }
    };

    return (
        <Modal
            open={open}
            title="Import Opening Stock"
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Upload"
            width={"80vw"}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Remarks" name="remarks" rules={[{ required: true, message: 'Remarks required' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label="Upload File (.csv, .xls, .xlsx)" required>
                            <Dragger
                                multiple={false}
                                maxCount={1}
                                accept=".csv,.xls,.xlsx"
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area</p>
                            </Dragger>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ImportOpeningStockModal;