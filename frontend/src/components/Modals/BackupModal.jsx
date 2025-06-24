import React, { useState } from 'react';
import { Modal, Spin, Button } from 'antd';

const BackupModal = ({ open, onCancel, onBackupSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleBackup = async () => {
        setLoading(true);
        await onBackupSuccess()
        setLoading(false);
    };

    return (
        <Modal
            title="Confirm Backup"
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>,
                <Button
                    key="backup"
                    type="primary"
                    onClick={handleBackup}
                    loading={loading}
                >
                    {loading ? 'Backing Up...' : 'Backup Now'}
                </Button>,
            ]}
            closable={!loading}
            maskClosable={!loading}
            keyboard={!loading}
        >
            <div className="text-center">
                {loading ? (
                    <Spin size="medium" />
                ) : (
                    <p>Are you sure you want to perform the backup?</p>
                )}
            </div>
        </Modal>
    );
};

export default BackupModal;
