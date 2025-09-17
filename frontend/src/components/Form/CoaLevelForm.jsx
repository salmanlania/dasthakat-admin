/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Table, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getAccountsList, getAccountCode, getHeadAccountList } from '../../store/features/coaAccountsSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';
import DebounceInput from '../Input/DebounceInput';
import AsyncSelectLedgerParent from '../AsyncSelectLedgerParent';

const CoaLevelForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, initialFormCodeValues, isListLoading, headAccountList } = useSelector(
    (state) => state.coaAccounts
  );

  const [submitAction, setSubmitAction] = useState(null);
  const [data, setData] = useState([]);
  const [shouldSyncData, setShouldSyncData] = useState(true);
  const [accountType, setAccountType] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const onFinish = (values) => {
    const data = {
      gl_type_id: values?.gl_types?.value ? values?.gl_types?.value : null,
      parent_account_id: values?.parent_account?.value ? values?.parent_account?.value : null,
      name: values?.coa_name ? values?.coa_name : null,
      // head_account_id: values?.head_account?.value ? values?.head_account?.value : null,
      account_code: values?.account_code ? values?.account_code : null,
    };
    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

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
        // parent_account: initialData?.parent_account_id
        //   ? { value: initialData?.parent_account_id, label: initialData?.parent_account }
        //   : undefined,
        // head_account: initialData?.head_account_id
        //   ? { value: initialData?.head_account_id, label: initialData?.head_account_name }
        //   : undefined,
        parent_account: initialData?.parent_account_name || undefined,
        // head_account: initialData?.head_account_id || undefined,
        // head_account: initialData?.head_account_id
        //   ? { value: initialData.head_account_id, label: initialData.head_account_name }
        //   : undefined,
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
          <Input value={record?.parent_account_name} />
        );
      },
      width: 150
    },
    // {
    //   title: 'Head Account',
    //   dataIndex: 'head_account_name',
    //   key: 'head_account_name',
    //   render: (_, record, index) => {
    //     return (
    //       <Input value={record?.head_account_name} disabled />
    //     );
    //   },
    //   width: 150
    // },
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
              ...initialData
            }
            : ''
        }
        scrollToFirstError>
        <Row gutter={16} style={{ display: 'flex', flexDirection: 'row' }}>
          <Col span={8}>
            <Form.Item name="gl_types" label="Account Type">
              <AsyncSelectLedger
                endpoint="/lookups/gl-types"
                valueKey="gl_type_id"
                labelKey="name"
                labelInValue
                className="w-full"
                onChange={(selected) => {
                  if (selected?.value) {
                    setAccountType(selected?.value);
                    // form.setFieldsValue({ head_account: undefined });
                  } else {
                    setShouldSyncData(false);
                    setData([])
                    // form.setFieldsValue({ head_account: undefined });
                  }
                }}
              />
            </Form.Item>
            <Form.Item name="account_code" label="Account Number" preserve={false}>
              <Input
                required
                allowClear
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
            <Form.Item name="coa_name" label="Account Name" preserve={false}>
              <Input required />
            </Form.Item>
            <Form.Item name="parent_account" label="Parent Account">
              <AsyncSelectLedgerParent
                // endpoint={`/accounts?exempt_account_id=${id}`}
                endpoint={mode === 'edit' ? `/accounts?exempt_account_id=${id}` : '/accounts'}
                valueKey="account_id"
                labelKey="name"
                labelInValue
                className="w-full"
                onChange={(selected) => {
                  if (!selected?.value) return;

                  if (selected?.value) {
                    const parentAcc = selected?.data;
                    setAccountType(parentAcc?.gl_type_id)
                    form.setFieldsValue({
                      gl_types: {
                        value: parentAcc.gl_type_id,
                        label: parentAcc.gl_type,
                      },
                      // head_account: {
                      //   value: parentAcc.head_account_id,
                      //   label: parentAcc.head_account_name,
                      // },
                    });
                  }
                }}
              />
            </Form.Item>
            {/* <Form.Item name="head_account" label="Head Account">
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
            </Form.Item> */}
          </Col>
          {/* </Row> */}
          {/* <Row>
          <Col span={24}>
            <h1>Your Table Title</h1>
          </Col>
        </Row> */}
          {/* <Row> */}
          {/* <Col span={16}>
            <h1>Your Table Title</h1>
            <div>
              {isListLoading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey={'head_account_id'}
                  size="small"
                  // scroll={{ x: 'calc(100% - 200px)' }}
                  scroll={{
                    x: 'max-content', // let table use full column widths
                    y: 350            // vertical scroll inside container
                  }}
                  pagination={false}
                // scroll={{
                //   y: 350,
                //   x: 'max-content'
                // }}
                />
              )}
            </div>
          </Col> */}
        </Row>
      </Form >

      {/* {isListLoading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey={'head_account_id'}
            size="small"
            scroll={{ x: 'calc(100% - 200px)' }}
            pagination={false}
            sticky={{
              offsetHeader: 56
            }}
          />
        )} */}

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

      </div>
    </>
  );
};

export default CoaLevelForm;