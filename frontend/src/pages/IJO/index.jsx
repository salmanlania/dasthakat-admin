import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegFilePdf } from 'react-icons/fa';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit, MdWorkspacePremium } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AsyncSelect from '../../components/AsyncSelect';
import PageHeading from '../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal';
import GenerateCertificateModal from '../../components/Modals/GenerateCertificateModal.jsx';
import useDebounce from '../../hooks/useDebounce';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import useError from '../../hooks/useError';
import {
  bulkDeleteIJO,
  deleteIJO,
  getIJOForPrint,
  getIJOList,
  setIJODeleteIDs,
  setIJOListParams,
} from '../../store/features/ijoSlice';
import { createIJOPrint } from '../../utils/prints/ijo-print.js';

const IJO = () => {
  useDocumentTitle('IJO List');
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs } = useSelector(
    (state) => state.ijo,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.job_order;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedJobOrderId, setSelectedJobOrderId] = useState(null);

  const openCertificateModal = (id) => {
    setSelectedJobOrderId(id);
    setCertificateModalOpen(true);
  };

  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedCode = useDebounce(params.document_identity, 500);
  const debouncedIMO = useDebounce(params.imo, 500);

  const onIJODelete = async (id) => {
    try {
      await dispatch(deleteIJO(id)).unwrap();
      toast.success('IJO deleted successfully');
      dispatch(getIJOList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteIJO(deleteIDs)).unwrap();
      toast.success('IJOs deleted successfully');
      closeDeleteModal();
      await dispatch(getIJOList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const printIJO = async (id) => {
    const loadingToast = toast.loading('Loading print...');

    try {
      const data = await dispatch(getIJOForPrint(id)).unwrap();
      toast.dismiss(loadingToast);
      createIJOPrint(data);
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.document_identity}
            onChange={(e) => dispatch(setIJOListParams({ document_identity: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'document_identity',
      key: 'document_identity',
      sorter: true,
      width: 120,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Event</p>
          <AsyncSelect
            endpoint="/event"
            valueKey="event_id"
            labelKey="event_code"
            size="small"
            className="w-full font-normal"
            value={params.event_id}
            onChange={(value) => dispatch(setIJOListParams({ event_id: value }))}
          />
        </div>
      ),
      dataIndex: 'event_code',
      key: 'event_code',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sales Person</p>
          <AsyncSelect
            endpoint="/salesman"
            valueKey="salesman_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.salesman_id}
            onChange={(value) => dispatch(setIJOListParams({ salesman_id: value }))}
          />
        </div>
      ),
      dataIndex: 'salesman_name',
      key: 'salesman_name',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Vessels</p>
          <AsyncSelect
            endpoint="/vessel"
            valueKey="vessel_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.vessel_id}
            onChange={(value) => dispatch(setIJOListParams({ vessel_id: value }))}
          />
        </div>
      ),
      dataIndex: 'vessel_name',
      key: 'vessel_name',
      width: 220,
    },
    {
      title: (
        <div>
          <p>IMO</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.imo}
            onChange={(e) => dispatch(setIJOListParams({ imo: e.target.value }))}
          />
        </div>
      ),
      dataIndex: 'imo',
      key: 'imo',
      sorter: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Flag</p>
          <AsyncSelect
            endpoint="/flag"
            valueKey="flag_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.flag_id}
            onChange={(value) => dispatch(setIJOListParams({ flag_id: value }))}
          />
        </div>
      ),
      dataIndex: 'flag_name',
      key: 'flag_name',
      width: 150,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 1</p>
          <AsyncSelect
            endpoint="/class"
            valueKey="class_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.class1_id}
            onChange={(value) => dispatch(setIJOListParams({ class1_id: value }))}
          />
        </div>
      ),
      dataIndex: 'class1_name',
      key: 'class1_name',
      width: 150,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Class 2</p>
          <AsyncSelect
            endpoint="/class"
            valueKey="class_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.class2_id}
            onChange={(value) => dispatch(setIJOListParams({ class2_id: value }))}
          />
        </div>
      ),
      dataIndex: 'class2_name',
      key: 'class2_name',
      width: 150,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Agent</p>
          <AsyncSelect
            endpoint="/agent"
            valueKey="agent_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.agent_id}
            onChange={(value) => dispatch(setIJOListParams({ agent_id: value }))}
          />
        </div>
      ),
      dataIndex: 'agent_name',
      key: 'agent_name',
      width: 150,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      width: 168,
      render: (_, { created_at }) => dayjs(created_at).format('MM-DD-YYYY hh:mm A'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { job_order_id }) => (
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip title="Print">
            <Button
              size="small"
              type="primary"
              className="bg-rose-600 hover:!bg-rose-500"
              icon={<FaRegFilePdf size={14} />}
              onClick={() => printIJO(job_order_id)}
            />
          </Tooltip>
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/ijo/edit/${job_order_id}`}>
                <Button
                  size="small"
                  type="primary"
                  className="bg-gray-500 hover:!bg-gray-400"
                  icon={<MdOutlineEdit size={14} />}
                />
              </Link>
            </Tooltip>
          ) : null}
          {permissions.delete ? (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete?"
                description="After deleting, You will not be able to recover it."
                okButtonProps={{ danger: true }}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onIJODelete(job_order_id)}>
                <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
              </Popconfirm>
            </Tooltip>
          ) : null}
          {permissions.edit ? (
            <Tooltip title="Add Certificate">
              <Button
                size="small"
                type="primary"
                // onClick={() => generateCertificate(job_order_id)}
                onClick={() => openCertificateModal(job_order_id)}
                className="bg-emerald-600 hover:!bg-emerald-500"
                icon={<MdWorkspacePremium size={14} />}
              />
            </Tooltip>
          ) : null}
        </div>
      ),
      width: 100,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    dispatch(getIJOList(params)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.event_id,
    params.salesman_id,
    params.vessel_id,
    params.flag_id,
    params.class1_id,
    params.class2_id,
    params.agent_id,
    debouncedSearch,
    debouncedCode,
    debouncedIMO,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>IJO</PageHeading>
        <Breadcrumb items={[{ title: 'IJO' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setIJOListParams({ search: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            {permissions.delete ? (
              <Button
                type="primary"
                danger
                onClick={() => setDeleteModalIsOpen(true)}
                disabled={!deleteIDs.length}>
                Delete
              </Button>
            ) : null}
            {permissions.add ? (
              <Link to="/ijo/create">
                <Button type="primary">Add New</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                  type: 'checkbox',
                  selectedRowKeys: deleteIDs,
                  onChange: (selectedRowKeys) => dispatch(setIJODeleteIDs(selectedRowKeys)),
                }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="job_order_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} IJO`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setIJOListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
            );
          }}
          dataSource={list}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <GenerateCertificateModal
        open={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        jobOrderId={selectedJobOrderId}
      />

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onBulkDelete}
        isDeleting={isBulkDeleting}
        title="Are you sure you want to delete these IJO?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default IJO;
