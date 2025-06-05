import { Modal, Checkbox, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getIJO, putIJOCertificate } from '../../store/features/ijoSlice';
import useError from '../../hooks/useError';
import toast from 'react-hot-toast';

const GenerateCertificateModal = ({ open, onClose, jobOrderId }) => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCerts, setSelectedCerts] = useState([]);
    const dispatch = useDispatch();
    const handleError = useError();

    const all_possible_types = ['LB', 'LSA/FFE', 'Calibration'];

    useEffect(() => {
        if (!jobOrderId || !open) return;

        (async () => {
            setLoading(true);
            try {
                const res = await dispatch(getIJO(jobOrderId)).unwrap();

                const existing = Array.isArray(res?.certificates)
                    ? res.certificates.filter(Boolean).map((i) => i.type)
                    : [];

                const missing = all_possible_types.filter(
                    (t) => !existing.includes(t)
                );

                setCertificates(missing.map(type => ({ key: type, type })));

            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [jobOrderId, open]);

    const handleOk = async () => {
        if (selectedCerts.length === 0) {
            toast.error('Certificates already generated');
            onClose();
            return;
        }

        const data = {
            certificate: selectedCerts.map(type => ({ type })),
        };

        try {
            setLoading(true);
            await dispatch(putIJOCertificate({ id: jobOrderId, data })).unwrap();
            setSelectedCerts([]);
            toast.success('Job Order Certificates Generated');
            onClose();
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedCerts([]);
        onClose();
    };

    const columns = [
        {
            title: 'Certificate Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Checkbox
                    checked={selectedCerts.includes(type)}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedCerts((prev) =>
                            checked
                                ? [...prev, type]
                                : prev.filter((t) => t !== type)
                        );
                    }}
                >
                    {type}
                </Checkbox>
            ),
        },
    ];

    return (
        <Modal
            title="Generate Certificates"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Generate"
            okButtonProps={{ disabled: certificates.length === 0 }}
        >
            {loading ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2rem',
                    }}
                >
                    <Spin />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={certificates}
                    pagination={false}
                    rowKey="type"
                />
            )}
        </Modal>
    );
};

export default GenerateCertificateModal