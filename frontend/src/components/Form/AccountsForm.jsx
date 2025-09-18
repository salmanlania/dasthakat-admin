
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getAccountsList, getAccountsTree, resetAccounts } from '../../store/features/accountsSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';
import AsyncSelectLedgerParent from '../AsyncSelectLedgerParent';
import AccountsTree from '../Tree/AccountsTree';
import useError from '../../hooks/useError';
const AccountsForm = ({ mode, onSubmit, onSave, onNew }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const handleError = useError();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, initialFormCodeValues, isListLoading, headAccountList, accountsTree, isTreeLoading } = useSelector(
    (state) => state.accounts
  );
  const [submitAction, setSubmitAction] = useState(null);
  const [data, setData] = useState([]);
  const [shouldSyncData, setShouldSyncData] = useState(true);
  const [accountType, setAccountType] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    setInitialData(initialFormValues)
    if (shouldSyncData) {
      setData(Array.isArray(headAccountList) ? headAccountList : []);
    }
    if (mode === 'edit' && initialData) {
      const gl_types = initialData?.gl_types || '';
      const gl_type_id = initialData?.gl_type_id || '';
      const code = (initialData?.code || '').toString().replace(/\D/g, '');
      const coa_name = initialData?.coa_name || '';
      setAccountType(gl_type_id);
      form.setFieldsValue({
        gl_types: gl_type_id
          ? { value: gl_type_id, label: gl_types }
          : undefined,
        code: code,
        coa_name: coa_name,
        account_code: initialData?.account_code || '',
        parent_account: initialData?.parent_account_id
          ? {
            value: initialData?.parent_account_id,
            label: initialData?.parent_account_name,
            data: initialData?.parent_account_data
          }
          : undefined,
        head_account: initialData?.head_account_id
          ? {
            value: initialData.head_account_id,
            label: initialData.head_account_name
          }
          : undefined,
      });

      if (gl_type_id) {
        dispatch(getAccountsList({ gl_type_id: gl_type_id }));
      }
    } else if (mode !== 'edit' && initialFormCodeValues) {
      form.setFieldsValue({
        code: (initialFormCodeValues?.code || '').toString().replace(/\D/g, '')
      });
    }
  }, [initialFormValues, initialData, mode, form]);

  const loadAccountsTree = async () =>  {
    try{

     await dispatch(
        getAccountsTree({
          gl_type_id: form.getFieldValue('gl_types')?.value,
          parent_account_id: form.getFieldValue('parent_account')?.value
        })
      ).unwrap();
    }catch(error){
      handleError(error);
      
    }
  }

  useEffect(() => {
    loadAccountsTree()
  }, []);



  const onFinish = async (values) => {
    const data = {
      gl_type_id: values?.gl_types?.value ? values?.gl_types?.value : null,
      parent_account_id: values?.parent_account?.value ? values?.parent_account?.value : initialFormValues?.parent_account_id ? initialFormValues?.parent_account_id : null,
      name: values?.coa_name ? values?.coa_name : null,
      head_account_id: values?.head_account?.value ? values?.head_account?.value : null,
      account_code: values?.account_code ? values?.account_code : null,
    };

    if (submitAction === 'save') {
      await onSubmit(data);
    } else if (submitAction === 'saveAndExit') {
      await onSave(data);
    } else if (submitAction === 'saveAndNew') {
      try {
        const result = await onNew(data);
        if (result && result.success) {
          form.resetFields();
          setInitialData(null);
          setAccountType(null);
          setParentId(null);
          loadAccountsTree();
        }
      } catch (error) {
      }
    }
  };

  return (
    <>
      <Form
        name="coaAccounts"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={
          mode === 'edit'
            ? {
              ...initialData
            }
            : ''
        }
        scrollToFirstError>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 '>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="parent_account" label="Parent Account">
                <AsyncSelectLedgerParent
                  endpoint={mode === 'edit' ? `/accounts?exempt_account_id=${id}` : '/accounts'}
                  valueKey="account_id"
                  labelKey="name"
                  labelInValue
                  className="w-full"
                  onChange={(selected) => {
                    loadAccountsTree()
                    if (!selected?.value) return;

                    if (selected?.value) {
                      setParentId(selected?.value);
                      const parentAcc = selected?.data;
                      setAccountType(parentAcc?.gl_type_id)
                      form.setFieldsValue({
                        gl_types: {
                          value: parentAcc.gl_type_id,
                          label: parentAcc.gl_type,
                        },
                        head_account: {
                          value: parentAcc.head_account_id,
                          label: parentAcc.head_account_name,
                        },
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="gl_types" label="Account Type" rules={[{ required: true }]}>
                <AsyncSelectLedger
                  endpoint="/lookups/gl-types"
                  valueKey="gl_type_id"
                  labelKey="name"
                  labelInValue
                  className="w-full"
                  onChange={(selected) => {
                    loadAccountsTree()
                    if (selected?.value) {
                      setAccountType(selected?.value);
                      form.setFieldsValue({ head_account: undefined });
                    } else {
                      setShouldSyncData(false);
                      setData([])
                      form.setFieldsValue({ head_account: undefined });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="account_code" label="Account Number" preserve={false} rules={[{ required: true }]}>
                <Input
                  required
                  allowClear
                  inputMode="numeric"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="coa_name" label="Account Name" preserve={false} rules={[{ required: true }]}>
                <Input required />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="head_account" label="Head Account">
                <AsyncSelectLedgerParent
                  key={accountType}
                  endpoint={`/accounts/account/heads?gl_type_id=${accountType || ''}`}
                  valueKey="head_account_id"
                  labelKey="head_account_name"
                  labelInValue
                  className="w-full"
                  onChange={(selected) => {
                    form.setFieldsValue({ head_account: selected?.value ? selected : null });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <AccountsTree
            treeData={accountsTree}
            loading={isTreeLoading}
            selected={initialFormValues?.account_id}
            onSelect={(node) => {
              if (mode !== 'edit' && node) {
                form.setFieldsValue({
                  gl_types: { value: node.gl_type_id, label: node.gl_type_name },
                  parent_account: { value: node.account_id, label: node.name },
                  head_account: { value: node.head_account_id, label: node.head_account_name },
                });
                loadAccountsTree()
              }
            }}
          />
        </div>
      </Form >

      <div className="mt-4 flex items-center justify-end gap-2">
        <Link to="/general-ledger/accounts">
          <Button className="w-28">Exit</Button>
        </Link>

        <Button
          type="primary"
          className="w-28"
          loading={isFormSubmitting && submitAction === 'save'}
          onClick={() => {
            setSubmitAction('save');
            form.submit()
          }}>
          Save
        </Button>

        <Button
          type="primary"
          className="w-28 bg-green-600 hover:!bg-green-500"
          loading={isFormSubmitting && submitAction === 'saveAndExit'}
          onClick={() => {
            setSubmitAction('saveAndExit');
            form.submit()
          }}>
          Save & Exit
        </Button>

        <Button
          type="primary"
          className="w-28 bg-orange-500 hover:!bg-orange-400"
          loading={isFormSubmitting && submitAction === 'saveAndNew'}
          onClick={() => {
            setSubmitAction('saveAndNew');
            form.submit()
          }}>
          Save & New
        </Button>

      </div>
    </>
  );
};

export default AccountsForm;