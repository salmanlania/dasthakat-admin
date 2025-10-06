import { Breadcrumb, Button, Input, Popconfirm, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoTrash } from 'react-icons/go';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PageHeading from '../../../components/Heading/PageHeading';
import DeleteConfirmModal from '../../../components/Modals/DeleteConfirmModal';
import useDebounce from '../../../hooks/useDebounce';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useError from '../../../hooks/useError';

import AsyncSelectLedger from '../../../components/AsyncSelectLedger';
import {
  bulkDeleteAccounts,
  deleteAccounts,
  getAccountsList,
  setAccountsDeleteIDs,
  setAccountsListParams,
} from '../../../store/features/accountsSlice';

const Accounts = () => {
  useDocumentTitle('Accounts List');
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { list, isListLoading, params, paginationInfo, isBulkDeleting, deleteIDs, listID, headAccountList } = useSelector(
    (state) => state.accounts
  );

  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission?.accounts;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedSaleInvoiceNo = useDebounce(params.gl_type, 500);
  const debouncedChargeNo = useDebounce(params.charge_no, 500);
  const debouncedQuotationNo = useDebounce(params.quotation_no, 500);

  const formattedParams = {
    ...params,
  };

  const onCoaAccountsDelete = async (id) => {
    try {
      await dispatch(deleteAccounts(id)).unwrap();
      toast.success('Accounts deleted successfully');
      dispatch(getAccountsList()).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    closeDeleteModal();
    try {
      const res = await dispatch(bulkDeleteAccounts(deleteIDs)).unwrap();
      toast.success(res.message ?? 'Accounts deleted successfully');
      closeDeleteModal();
      await dispatch(getAccountsList(formattedParams)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
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
              dispatch(setAccountsListParams({ gl_type_id: value || null }))
            }}
          />
        </div>
      ),
      dataIndex: 'gl_type',
      key: 'gl_type',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, record, index) => record?.gl_type,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Parent Account</p>
          <AsyncSelectLedger
            endpoint="/accounts"
            size="small"
            className="w-full font-normal"
            valueKey="account_id"
            labelKey="name"
            allowClear
            value={params.parent_account_id}
            onChange={(value) => {
              dispatch(setAccountsListParams({ parent_account_id: value || null }))
            }}
          />
        </div>
      ),
      dataIndex: 'parent_account_name',
      key: 'parent_account_name',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, record, index) => record?.parent_account_name,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Account Code</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.account_code}
            onChange={(e) =>
              dispatch(
                setAccountsListParams({
                  account_code: e.target.value || "",
                }),
              )
            }
          />
        </div>
      ),
      render: (_, record, index) => record?.account_code ? record?.account_code : '',
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Account Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.name}
            onChange={(e) =>
              dispatch(
                setAccountsListParams({
                  name: e.target.value || "",
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, record, index) => record?.name,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Head Account</p>
          <AsyncSelectLedger
            endpoint="/accounts/account/heads"
            size="small"
            className="w-full font-normal"
            valueKey="head_account_id"
            labelKey="head_account_name"
            allowClear
            value={params.head_account_id}
            onChange={(value) => {
              dispatch(setAccountsListParams({ head_account_id: value || null }))
            }}
          />
        </div>
      ),
      dataIndex: 'head_account_name',
      key: 'head_account_name',
      sorter: true,
      width: 180,
      ellipsis: true,
      render: (_, record, index) => record?.head_account_name,
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
      render: (_, { account_id }) => (
        <div className="flex flex-col justify-center gap-1">
          {permissions.edit ? (
            <>
              <div className="flex items-center gap-1">
                <Tooltip title="Edit">
                  <Link to={`/general-ledger/gl-setup/accounts/edit/${account_id}`}>
                    <Button
                      size="small"
                      type="primary"
                      className="bg-gray-500 hover:!bg-gray-400"
                      icon={<MdOutlineEdit size={14} />}
                    />
                  </Link>
                </Tooltip>
                {permissions.delete && _.is_post == 0 ? (
                  <Tooltip title="Delete">
                    <Popconfirm
                      title="Are you sure you want to delete?"
                      description="After deleting, You will not be able to recover it."
                      okButtonProps={{ danger: true }}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => onCoaAccountsDelete(account_id)}>
                      <Button size="small" type="primary" danger icon={<GoTrash size={14} />} />
                    </Popconfirm>
                  </Tooltip>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      ),
      width: 50,
      fixed: 'right',
    },
  ];

  if (!permissions.edit && !permissions.delete) {
    columns.pop();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAccountsList(formattedParams)).unwrap().catch(handleError);
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
    params.account_code,
    params.parent_account_name,
    params.head_account_name,
    params.name,
    params.account_id,
    params.parent_account_id,
    debouncedSearch,
    debouncedSaleInvoiceNo,
    debouncedChargeNo,
    debouncedQuotationNo,
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <PageHeading>ACCOUNTS</PageHeading>
        <Breadcrumb items={[{ title: 'General Ledger' }, { title: 'Accounts' }, { title: 'List' }]} separator=">" />
      </div>

      <div className="mt-4 rounded-md bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <Input
            placeholder="Search..."
            className="w-full sm:w-64"
            value={params.search}
            onChange={(e) => dispatch(setAccountsListParams({ search: e.target.value || '' }))}
            allowClear
          />
          <div className='flex items-center justify-between gap-2'>
            <div className="flex items-center gap-2">
              {permissions.add ? (
                <Button
                  type="primary"
                  onClick={() => navigate('/general-ledger/gl-setup/accounts/create')}
                >
                  Create
                </Button>
              ) : null}
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
                onChange: (selectedRowKeys) => dispatch(setAccountsDeleteIDs(selectedRowKeys)),
                getCheckboxProps: (record) => ({
                  disabled: record.is_post === 1,
                }),
              }
              : null
          }
          loading={isListLoading}
          className="mt-2"
          rowKey="account_id"
          scroll={{ x: 'calc(100% - 200px)' }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} accounts`,
          }}
          onChange={(page, _, sorting) => {
            dispatch(
              setAccountsListParams({
                page: page.current,
                limit: page.pageSize,
                sort_column: sorting.field,
                sort_direction: sorting.order,
              }),
            );
          }}
          dataSource={headAccountList}
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
        title="Are you sure you want to delete these Accounts?"
        description="After deleting, you will not be able to recover."
      />
    </>
  );
};

export default Accounts;
