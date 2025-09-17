/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Table, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAccountsList, getAccountCode, getHeadAccountList, getAccountsTree } from '../../store/features/coaAccountsSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';
import DebounceInput from '../Input/DebounceInput';
import AccountsTree from '../Tree/AccountsTree';

const CoaLevelForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, initialFormCodeValues, isListLoading, headAccountList, accountsTree, isTreeLoading } = useSelector(
    (state) => state.coaAccounts
  );

  const [submitAction, setSubmitAction] = useState(null);
  const [data, setData] = useState([]);
  const [shouldSyncData, setShouldSyncData] = useState(true);
  const [accountType, setAccountType] = useState(null);
  const [selectedGlTypeId, setSelectedGlTypeId] = useState(null);
  const [selectedParentAccountId, setSelectedParentAccountId] = useState(null);

  const onFinish = (values) => {
    const data = {
      gl_type_id: values?.gl_types?.value ? values?.gl_types?.value : null,
      parent_account_id: values?.parent_account?.value ? values?.parent_account?.value : null,
      name: values?.coa_name ? values?.coa_name : null,
      head_account_id: values?.head_account?.value ? values?.head_account?.value : null,
      account_code: values?.account_code ? values?.account_code : null,
    };

    console.log('data', data);

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  useEffect(() => {
    if (shouldSyncData) {
      setData(Array.isArray(headAccountList) ? headAccountList : []);
    }
    if (mode === 'edit' && initialFormValues) {
      const gl_types = initialFormValues?.gl_types || '';
      const gl_type_id = initialFormValues?.gl_type_id || '';
      const parent_account_id = initialFormValues?.parent_account_id || '';
      const parent_account_name = initialFormValues?.parent_account_name || '';
      const code = (initialFormValues?.code || '').toString().replace(/\D/g, '');
      const coa_name = initialFormValues?.coa_name || '';
      form.setFieldsValue({
        gl_types: gl_type_id
          ? { value: gl_type_id, label: gl_types }
          : undefined,
        parent_account: parent_account_id
          ? { value: parent_account_id, label: parent_account_name }
          : undefined,
        code: code,
        coa_name: coa_name,
      });

      // Set selected states for tree loading
      if (gl_type_id) {
        setSelectedGlTypeId(gl_type_id);
        dispatch(getAccountsList({ gl_type_id: gl_type_id }));
      }
      if (parent_account_id) {
        setSelectedParentAccountId(parent_account_id);
      }
    } else if (mode !== 'edit' && initialFormCodeValues) {
      form.setFieldsValue({
        code: (initialFormCodeValues?.code || '').toString().replace(/\D/g, '')
      });
    }
  }, [initialFormValues, initialFormCodeValues, form, mode, headAccountList, shouldSyncData]);

  // Fetch accounts tree when gl_type or parent_account changes
  useEffect(() => {
    if (selectedGlTypeId || selectedParentAccountId) {
      dispatch(getAccountsTree({
        gl_type_id: selectedGlTypeId,
        parent_account_id: selectedParentAccountId
      }));
    }
  }, [selectedGlTypeId, selectedParentAccountId, dispatch]);

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 35
    },
    {
      title: 'Account Type',
      dataIndex: 'gl_type',
      key: 'gl_type',
      render: (_, record, index) => {
        return (
          <DebounceInput
            disabled
            value={record?.gl_type}
          />
        );
      },
      width: 100
    },
    {
      title: 'Account Number',
      dataIndex: 'account_code',
      key: 'account_code',
      render: (_, record, index) => {
        const cleanValue = String(record?.account_code || '').replace(/\D/g, '');
        return (
          <Input value={cleanValue} disabled />
        );
      },
      width: 100
    },
    {
      title: 'Account Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record, index) => {
        return (
          <Input value={record.name} disabled />
        );
      },
      width: 150
    },
    {
      title: 'Parent Account',
      dataIndex: 'parent_account_name',
      key: 'parent_account_name',
      render: (_, record, index) => {
        return (
          <Input value={record?.parent_account_name} disabled />
        );
      },
      width: 150
    },
    {
      title: 'Head Account',
      dataIndex: 'head_account_name',
      key: 'head_account_name',
      render: (_, record, index) => {
        return (
          <Input value={record?.head_account_name} disabled />
        );
      },
      width: 150
    },
  ];

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
              ...initialFormValues
            }
            : { document_date: dayjs() }
        }
        scrollToFirstError>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div className=''>

            <Row gutter={12}>
              <Col span={24} sm={12} md={8} lg={12}>
                <Form.Item name="parent_account" label="Parent Account">
                  <AsyncSelectLedger
                    endpoint="/accounts"
                    valueKey="account_id"
                    disabled={mode === 'edit' ? true : false}
                    labelKey="name"
                    labelInValue
                    className="w-full"
                    onChange={(selected) => {
                      setSelectedParentAccountId(selected?.value || null);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={12} md={8} lg={12}>
                <Form.Item name="gl_types" label="Account Type">
                  <AsyncSelectLedger
                    endpoint="/lookups/gl-types"
                    valueKey="gl_type_id"
                    disabled={mode === 'edit' ? true : false}
                    labelKey="name"
                    labelInValue
                    className="w-full"
                    onChange={(selected) => {
                      if (selected?.value) {
                        dispatch(getAccountsList({ gl_type_id: selected.value }));
                        setAccountType(selected);
                        setSelectedGlTypeId(selected.value);
                        dispatch(getHeadAccountList({ gl_type_id: selected.value }));
                      } else {
                        setShouldSyncData(false);
                        setData([]);
                        setSelectedGlTypeId(null);
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={24} sm={12} md={8} lg={12}>
                <Form.Item name="account_code" label="Account Number">
                  <Input
                    required
                    allowClear
                    disabled={mode === 'edit' ? true : false}
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      let pasteData = e.clipboardData.getData("text");
                      pasteData = pasteData.slice(0, 3);
                      const numbersOnly = pasteData.replace(/\D/g, "");
                      if (numbersOnly) {
                        const input = e.target;
                        const start = input.selectionStart;
                        const end = input.selectionEnd;

                        const newValue =
                          input.value.substring(0, start) +
                          numbersOnly +
                          input.value.substring(end);

                        input.value = newValue.slice(0, 3);

                        const event = new Event("input", { bubbles: true });
                        input.dispatchEvent(event);
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={12} md={8} lg={12}>
                <Form.Item name="coa_name" label="Account Name">
                  <Input required />
                </Form.Item>
              </Col>


              <Col span={24} sm={12} md={8} lg={12}>
                <Form.Item name="head_account" label="Head Account"> {/* pl statement */}
                  <AsyncSelectLedger
                    endpoint={`/accounts/account/heads?gl_type_id=${accountType?.value || ''}`}
                    valueKey="head_account_id"
                    disabled={mode === 'edit' ? true : false}
                    labelKey="head_account_name"
                    labelInValue
                    className="w-full"
                    onChange={(selected) => {
                      form.setFieldsValue({ head_account: selected });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>

            {/* Accounts Tree View */}
            {(selectedGlTypeId || selectedParentAccountId) && (
              <AccountsTree
                treeData={accountsTree}
                loading={isTreeLoading}
                onSelect={(node) => {
                  if (mode !== 'edit' && node) {
                    // Set form values directly
                    form.setFieldsValue({
                      gl_types: { value: node.gl_type_id, label: node.gl_type_name },   // assuming backend returns name
                      parent_account: { value: node.account_id, label: node.name },
                      head_account: { value: node.head_account_id, label: node.head_account_name },
                    });

                    // Also sync state so dependent queries work
                    if (node.gl_type_id) {
                      setSelectedGlTypeId(node.gl_type_id);
                    }
                    if (node.parent_account_id) {
                      setSelectedParentAccountId(node.parent_account_id);
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/coa/level">
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

        </div>
      </Form>
    </>
  );
};

export default CoaLevelForm;