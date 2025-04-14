import { Breadcrumb, Button, Input, Popconfirm, Table, Tabs, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegSave } from 'react-icons/fa';
import { FcCancel } from 'react-icons/fc';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';
import {
    addNewBrand,
    bulkDeleteBrand,
    createBrand,
    deleteBrand,
    getAuditList,
    removeNewBrand,
    setBrandDeleteIDs,
    setBrandEditable,
    setBrandListParams,
    updateBrand,
    updateBrandListValue
} from '../../store/features/auditSlice';
import TabPane from 'antd/es/tabs/TabPane';

const Brand = () => {
    const dispatch = useDispatch();
    const handleError = useError();
    const { list, isListLoading, params, paginationInfo, isBulkDeleting, isSubmitting, deleteIDs } =
        useSelector((state) => state.audit);
    const { user } = useSelector((state) => state.auth);
    const permissions = user.permission.brand;

    const debouncedSearch = useDebounce(params.search, 500);

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
    const closeDeleteModal = () => setDeleteModalIsOpen(null);

    const onChange = (id, field, value) => {
        dispatch(updateBrandListValue({ id, field, value }));
    };

    const onCreate = async (record) => {
        const { name } = record;
        if (!name.trim()) return toast.error('Name field is required');

        try {
            await dispatch(createBrand({ name })).unwrap();
            await dispatch(getAuditList(params)).unwrap();
        } catch (error) {
            handleError(error);
        }
    };

    const onUpdate = async (record) => {
        const { brand_id, name } = record;

        if (!name.trim()) return toast.error('Name field is required');

        try {
            await dispatch(
                updateBrand({
                    id: brand_id,
                    data: { name }
                })
            ).unwrap();
            await dispatch(getAuditList(params)).unwrap();
        } catch (error) {
            handleError(error);
        }
    };

    const onCancel = async (id) => {
        if (id === 'new') return dispatch(removeNewBrand());
        dispatch(setBrandEditable({ id, editable: false }));
    };

    const onBrandDelete = async (id) => {
        try {
            await dispatch(deleteBrand(id)).unwrap();
            toast.success('Brand deleted successfully');
            dispatch(getAuditList(params)).unwrap();
        } catch (error) {
            handleError(error);
        }
    };

    const onBulkDelete = async () => {
        try {
            await dispatch(bulkDeleteBrand(deleteIDs)).unwrap();
            toast.success('Brand deleted successfully');
            closeDeleteModal();
            await dispatch(getAuditList(params)).unwrap();
        } catch (error) {
            handleError(error);
        }
    };

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            sorter: true,
            width: 20,
            ellipsis: true,
            render: (_, { action, editable, id }) =>
                editable ? (
                    <Input
                        autoFocus
                        defaultValue={action}
                        onBlur={(e) => onChange(id, 'action', e.target.value)}
                    />
                ) : (

                    action == "Delete" ?
                        <span className='block w-20 text-center py-1 rounded text-xs text-white bg-rose-600'>{action}</span> :
                        action == "Update" ?
                            <span className='block w-20 text-center py-1 rounded text-xs text-white bg-sky-700'>{action}</span> :
                            <span className='block w-20 text-center py-1 rounded text-xs text-white bg-emerald-700'>{action}</span>
                )
        },
        {
            title: 'Action By',
            dataIndex: 'action_by',
            key: 'action_by',
            sorter: true,
            width: 40,
            render: (_, { action_by }) =>
                action_by

        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            sorter: true,
            width: 40,
            render: (_, { company }) =>
                company?.name || null

        },
        {
            title: 'Company Branch',
            dataIndex: 'company_branch',
            key: 'company_branch',
            sorter: true,
            width: 40,
            render: (_, { company_branch }) =>
                company_branch?.name || null

        },
        {
            title: 'Action Date',
            dataIndex: 'action_at',
            key: 'action_at',
            sorter: true,
            width: 40,
            render: (_, { action_at }) =>
                dayjs(action_at).format('MM-DD-YYYY hh:mm A')

        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => {
        //         const { brand_id, editable } = record;

        // if (editable) {
        //     return (
        //         <div className="flex items-center gap-2">
        //             <Tooltip title="Cancel" onClick={() => onCancel(brand_id)}>
        //                 <Button danger icon={<FcCancel size={20} />} size="small" />
        //             </Tooltip>
        //             <Tooltip title="Save">
        //                 <Button
        //                     type="primary"
        //                     size="small"
        //                     icon={<FaRegSave size={16} />}
        //                     loading={isSubmitting === brand_id}
        //                     onClick={() => (brand_id === 'new' ? onCreate(record) : onUpdate(record))}
        //                 />
        //             </Tooltip>
        //         </div>
        //     );
        // }

        // return (
        //     <div className="flex items-center gap-2">
        //         {permissions.edit ? (
        //             <Tooltip title="Edit">
        //                 <Button
        //                     size="small"
        //                     type="primary"
        //                     className="bg-gray-500 hover:!bg-gray-400"
        //                     icon={<MdOutlineEdit size={14} />}
        //                     onClick={() =>
        //                         dispatch(
        //                             setBrandEditable({
        //                                 id: brand_id,
        //                                 editable: true
        //                             })
        //                         )
        //                     }
        //                 />
        //             </Tooltip>
        //         ) : null}
        //         {permissions.delete ? (
        //             <Tooltip title="Delete">
        //                 <Popconfirm
        //                     title="Are you sure you want to delete?"
        //                     description="After deleting, You will not be able to recover it."
        //                     okButtonProps={{ danger: true }}
        //                     okText="Yes"
        //                     cancelText="No"
        //                     onConfirm={() => onBrandDelete(brand_id)}>
        //                     <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
        //                 </Popconfirm>
        //             </Tooltip>
        //         ) : null}
        //     </div>
        // );
        //     },
        //     width: 70,
        //     fixed: 'right'
        // }
    ];

    if (!permissions.edit && !permissions.delete && !permissions.add) {
        columns.pop();
    }

    useEffect(() => {
        dispatch(getAuditList(params)).unwrap().catch(handleError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.page, params.limit, params.sort_column, params.sort_direction, debouncedSearch]);

    return (
        <>
            {/* <div className="flex flex-wrap items-center justify-between">
                <PageHeading>Audit Logs</PageHeading>
                <Breadcrumb items={[{ title: 'Audit' }, { title: 'List' }]} separator=">" />
                </div> */}

            <div className='p-2'>
                <div className=' flex items-center gap-2'>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Reports</p>
                        <h1 className='text-2xl font-medium'>Audit Overview</h1>
                    </div>
                    <div className='w-1 rounded-full h-1 animate-ping bg-green-600' ></div>
                </div>
                <div className='flex items-center gap-1 p-1 bg-gray-200 w-fit rounded-md mt-2'>
                    <Button type="primary" className="!bg-white !text-gray-950 text-xs shadow-none">Logs</Button>
                    <Button type="primary" className="!bg-transparent !text-gray-800 text-xs shadow-none">Storage</Button>
                </div>
            </div>

            <div className="rounded-md bg-white p-2">
                {/* <div className="flex items-center justify-between gap-2">
                    <Input
                        placeholder="Search..." allowClear
                        className="w-full sm:w-64"
                        value={params.search}
                        onChange={(e) => dispatch(setBrandListParams({ search: e.target.value }))}
                    />

                </div> */}
                <div className='p-3'>
                    {/* 
                    <Tabs defaultActiveKey="1" type="line" tabPosition="top">
                        <TabPane tab="Logs" key="1">
                   
                        </TabPane>
                        <TabPane tab="Preview" key="2">
                            Content of Products tab
                        </TabPane>
                    </Tabs> */}
                    <Table
                        size="small"
                        rowHoverable={false}
                        // rowSelection={
                        //     permissions.delete
                        //         ? {
                        //             type: 'checkbox',
                        //             selectedRowKeys: deleteIDs,
                        //             onChange: (selectedRowKeys) => dispatch(setBrandDeleteIDs(selectedRowKeys)),
                        //             getCheckboxProps: (record) => ({
                        //                 disabled: record.brand_id === 'new'
                        //             })
                        //         }
                        //         : null
                        // }
                        onChange={(page, _, sorting) => {
                            dispatch(
                                setBrandListParams({
                                    page: page.current,
                                    limit: page.pageSize,
                                    sort_column: sorting.field,
                                    sort_direction: sorting.order
                                })
                            );
                        }}
                        loading={isListLoading}
                        rowKey="id"
                        className="mt-2"
                        scroll={{ x: 'calc(100% - 200px)' }}
                        pagination={{
                            total: paginationInfo.total_records,
                            pageSize: params.limit,
                            current: params.page,
                            showTotal: (total) => `Total ${total} Actions`
                        }}
                        dataSource={list}
                        showSorterTooltip={false}
                        columns={columns}
                        sticky={{
                            offsetHeader: 56
                        }}
                    />
                </div>

            </div>

            <DeleteConfirmModal
                open={deleteModalIsOpen ? true : false}
                onCancel={closeDeleteModal}
                onDelete={onBulkDelete}
                isDeleting={isBulkDeleting}
                title="Are you sure you want to delete these brand?"
                description="After deleting, you will not be able to recover."
            />
        </>
    );
};

export default Brand;
