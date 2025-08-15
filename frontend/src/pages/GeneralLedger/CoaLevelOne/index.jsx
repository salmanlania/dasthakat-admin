import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AsyncSelect from '../../../components/AsyncSelect';
import PageHeading from '../../../components/Heading/PageHeading';
import DebounceInput from '../../../components/Input/DebounceInput';
import DeleteConfirmModal from '../../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../../hooks/useDebounce';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';

import {
  bulkDeleteCoaLevelOne,
  deleteCoaLevelOne,
  getCoaLevelOne,
  setCoaLevelOneDeleteIDs,
  setCoaLevelOneListParams,
} from '../../../store/features/coaOneSlice';
import AsyncSelectLedger from '../../../components/AsyncSelectLedger';

const CoaLevelOne = () => {
  useDocumentTitle('Chart Of Account Level One List');
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs, listID, coaLevelOneList } = useSelector(
    (state) => state.coaOne
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission.sale_invoice;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedSaleInvoiceNo = useDebounce(params.gl_type, 500);
  const debouncedChargeNo = useDebounce(params.charge_no, 500);
  const debouncedQuotationNo = useDebounce(params.quotation_no, 500);

  const formattedParams = {
    ...params,
  };

  const onCoaLevelOneDelete = async (id) => {
    try {
      await dispatch(deleteCoaLevelOne(id)).unwrap();
      toast.success('Chart Of Account Level One deleted successfully');
      dispatch(getCoaLevelOne()).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    try {
      await dispatch(bulkDeleteCoaLevelOne(deleteIDs)).unwrap();
      toast.success('Chart Of Account Level Ones deleted successfully');
      closeDeleteModal();
      await dispatch(getCoaLevelOne(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Account Type</p>
          <AsyncSelectLedger
            endpoint="/lookups/gl-types"
            size="small"
            className="w-full font-normal"
            valueKey="gl_type_id"
            labelKey="name"
            allowClear
            value={params.gl_type_id}
            onChange={(value) => {
              dispatch(setCoaLevelOneListParams({ gl_type_id: value || null }))
            }}
          />
        </div>
      ),
      dataIndex: 'gl_type',
      key: 'gl_type',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, record, index) => {
        return (
          <DebounceInput
            disabled
            value={record?.gl_type}
          />
        );
      },
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.level1_code}
            onChange={(e) =>
              dispatch(
                setCoaLevelOneListParams({
                  level1_code: e.target.value || "",
                }),
              )
            }
          />
        </div>
      ),
      render: (_, record, { product_id }, index) => {
        return (
          <Input value={record.level1_code} disabled />
        );
      },
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Name</p>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, record, index) => {
        return (
          <Input value={record.name} disabled />
        );
      },
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
      title: <div style={{ textAlign: 'center', width: '100%' }}>Action</div>,
      key: 'action',
      render: (_, { coa_level1_id }) => (
        <div className="flex flex-col justify-center gap-1">
          {permissions.edit ? (
            <>
              <div className="flex items-center gap-1">
                <Tooltip title="Edit">
                  <Link to={`/general-ledger/coa/level1/edit/${coa_level1_id}`}>
                    <Button
                      size="small"
                      type="primary"
                      className="bg-gray-500 hover:!bg-gray-400"
                      icon={<MdOutlineEdit size={14} />}
                    />
                  </Link>
                </Tooltip>
                {permissions.delete ? (
                  <Tooltip title="Delete">
                    <Popconfirm
                      title="Are you sure you want to delete?"
                      description="After deleting, You will not be able to recover it."
                      okButtonProps={{ danger: true }}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => onCoaLevelOneDelete(coa_level1_id)}>
                      <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                    </Popconfirm>
                  </Tooltip>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      ),
      width: 40,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getCoaLevelOne(formattedParams)).unwrap().catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.document_date,
    params.gl_type_id,
    params.customer_id,
    params.event_id,
    params.vessel_id,
    params.level1_code,
    debouncedSearch,
    debouncedSaleInvoiceNo,
    debouncedChargeNo,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>COA LEVEL ONE</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'COA Level One' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setCoaLevelOneListParams({ search: e.target.value || '' }))}
            allowClear
          />
          <div className='flex items-center justify-between gap-2'>
            <div className="flex items-center gap-2">
              {/* {permissions.delete ? ( */}
              <Button
                type="primary"
                onClick={() => navigate('/general-ledger/coa/level1/create')}
              >
                Create
              </Button>
              {/* ) : null} */}
            </div>
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
            </div>
          </div>
        </div>

        <Table
          size="small"
          rowSelection={
            permissions.delete
              ? {
                type: 'checkbox',
                selectedRowKeys: deleteIDs,
                onChange: (selectedRowKeys) => dispatch(setCoaLevelOneDeleteIDs(selectedRowKeys)),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="coa_level1_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} coa level one`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setCoaLevelOneListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
            );
          }}
          dataSource={coaLevelOneList}
          showSorterTooltip={false}
          columns={columns}
          sticky={{
            offsetHeader: 56,
          }}
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isBulkDeleting}
        onDelete={onBulkDelete}
        title="Are you sure you want to delete these COA level one?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default CoaLevelOne;
