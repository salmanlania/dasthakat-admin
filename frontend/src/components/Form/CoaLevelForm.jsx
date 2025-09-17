// /* eslint-disable react/prop-types */
// import { Button, Col, Form, Input, Row, Table, Spin } from 'antd';
// import dayjs from 'dayjs';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { getAccountsList, getAccountCode, getHeadAccountList, getAccountsTree } from '../../store/features/coaAccountsSlice';
// import AsyncSelectLedger from '../AsyncSelectLedger';
// import DebounceInput from '../Input/DebounceInput';
// <<<<<<< HEAD
// import AccountsTree from '../Tree/AccountsTree';
// =======
// import AsyncSelectLedgerParent from '../AsyncSelectLedgerParent';
// >>>>>>> ledger

// const CoaLevelForm = ({ mode, onSubmit, onSave }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { isFormSubmitting, initialFormValues, initialFormCodeValues, isListLoading, headAccountList, accountsTree, isTreeLoading } = useSelector(
//     (state) => state.coaAccounts
//   );

//   const [submitAction, setSubmitAction] = useState(null);
//   const [data, setData] = useState([]);
//   const [shouldSyncData, setShouldSyncData] = useState(true);
//   const [accountType, setAccountType] = useState(null);
// <<<<<<< HEAD
//   const [selectedGlTypeId, setSelectedGlTypeId] = useState(null);
//   const [selectedParentAccountId, setSelectedParentAccountId] = useState(null);
// =======
//   const [initialData, setInitialData] = useState(null);
// >>>>>>> ledger

//   const onFinish = (values) => {
//     const data = {
//       gl_type_id: values?.gl_types?.value ? values?.gl_types?.value : null,
//       parent_account_id: values?.parent_account?.value ? values?.parent_account?.value : null,
//       name: values?.coa_name ? values?.coa_name : null,
//       head_account_id: values?.head_account?.value ? values?.head_account?.value : null,
//       account_code: values?.account_code ? values?.account_code : null,
//     };
//     submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
//   };

//   useEffect(() => {
//     setInitialData(initialFormValues)
//     if (shouldSyncData) {
//       setData(Array.isArray(headAccountList) ? headAccountList : []);
//     }
// <<<<<<< HEAD
//     if (mode === 'edit' && initialFormValues) {
//       const gl_types = initialFormValues?.gl_types || '';
//       const gl_type_id = initialFormValues?.gl_type_id || '';
//       const parent_account_id = initialFormValues?.parent_account_id || '';
//       const parent_account_name = initialFormValues?.parent_account_name || '';
//       const code = (initialFormValues?.code || '').toString().replace(/\D/g, '');
//       const coa_name = initialFormValues?.coa_name || '';
// =======
//     if (mode === 'edit' && initialData) {
//       const gl_types = initialData?.gl_types || '';
//       const gl_type_id = initialData?.gl_type_id || '';
//       const code = (initialData?.code || '').toString().replace(/\D/g, '');
//       const coa_name = initialData?.coa_name || '';
//       setAccountType(gl_type_id);
// >>>>>>> ledger
//       form.setFieldsValue({
//         gl_types: gl_type_id
//           ? { value: gl_type_id, label: gl_types }
//           : undefined,
//         parent_account: parent_account_id
//           ? { value: parent_account_id, label: parent_account_name }
//           : undefined,
//         code: code,
//         coa_name: coa_name,
//         account_code: initialData?.account_code || '',
//         // parent_account: initialData?.parent_account_id
//         //   ? { value: initialData?.parent_account_id, label: initialData?.parent_account }
//         //   : undefined,
//         // head_account: initialData?.head_account_id
//         //   ? { value: initialData?.head_account_id, label: initialData?.head_account_name }
//         //   : undefined,
//         parent_account: initialData?.parent_account_name || undefined,
//         // head_account: initialData?.head_account_id || undefined,
//         head_account: initialData?.head_account_id
//           ? { value: initialData.head_account_id, label: initialData.head_account_name }
//           : undefined,
//       });

//       // Set selected states for tree loading
//       if (gl_type_id) {
//         setSelectedGlTypeId(gl_type_id);
//         dispatch(getAccountsList({ gl_type_id: gl_type_id }));
//       }
//       if (parent_account_id) {
//         setSelectedParentAccountId(parent_account_id);
//       }
//     } else if (mode !== 'edit' && initialFormCodeValues) {
//       form.setFieldsValue({
//         code: (initialFormCodeValues?.code || '').toString().replace(/\D/g, '')
//       });
//     }
//   }, [initialFormValues, initialData, mode, form]);

//   // Fetch accounts tree when gl_type or parent_account changes
//   useEffect(() => {
//     if (selectedGlTypeId || selectedParentAccountId) {
//       dispatch(getAccountsTree({
//         gl_type_id: selectedGlTypeId,
//         parent_account_id: selectedParentAccountId
//       }));
//     }
//   }, [selectedGlTypeId, selectedParentAccountId, dispatch]);

//   const columns = [
//     {
//       title: 'Sr.',
//       dataIndex: 'sr',
//       key: 'sr',
//       render: (_, record, index) => {
//         return <>{index + 1}.</>;
//       },
//       width: 35
//     },
//     {
//       title: 'Account Type',
//       dataIndex: 'gl_type',
//       key: 'gl_type',
//       render: (_, record, index) => {
//         return (
//           <DebounceInput
//             disabled
//             value={record?.gl_type}
//           />
//         );
//       },
//       width: 100
//     },
//     {
//       title: 'Account Number',
//       dataIndex: 'account_code',
//       key: 'account_code',
//       render: (_, record, index) => {
//         const cleanValue = String(record?.account_code || '').replace(/\D/g, '');
//         return (
//           <Input value={cleanValue} disabled />
//         );
//       },
//       width: 100
//     },
//     {
//       title: 'Account Name',
//       dataIndex: 'name',
//       key: 'name',
//       render: (_, record, index) => {
//         return (
//           <Input value={record.name} disabled />
//         );
//       },
//       width: 150
//     },
//     {
//       title: 'Parent Account',
//       dataIndex: 'parent_account_name',
//       key: 'parent_account_name',
//       render: (_, record, index) => {
//         return (
//           <Input value={record?.parent_account_name} />
//         );
//       },
//       width: 150
//     },
//     {
//       title: 'Head Account',
//       dataIndex: 'head_account_name',
//       key: 'head_account_name',
//       render: (_, record, index) => {
//         return (
//           <Input value={record?.head_account_name} disabled />
//         );
//       },
//       width: 150
//     },
//   ];

//   return (
//     <>
//       <Form
//         name="coaAccounts"
//         layout="vertical"
//         autoComplete="off"
//         form={form}
//         onFinish={onFinish}
//         initialValues={
//           mode === 'edit'
//             ? {
//               ...initialData
//             }
//             : ''
//         }
//         scrollToFirstError>
// <<<<<<< HEAD
//         <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
//           <div className=''>

//             <Row gutter={12}>
//               <Col span={24} sm={12} md={8} lg={12}>
//                 <Form.Item name="parent_account" label="Parent Account">
//                   <AsyncSelectLedger
//                     endpoint="/accounts"
//                     valueKey="account_id"
//                     disabled={mode === 'edit' ? true : false}
//                     labelKey="name"
//                     labelInValue
//                     className="w-full"
//                     onChange={(selected) => {
//                       setSelectedParentAccountId(selected?.value || null);
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24} sm={12} md={8} lg={12}>
//                 <Form.Item name="gl_types" label="Account Type">
//                   <AsyncSelectLedger
//                     endpoint="/lookups/gl-types"
//                     valueKey="gl_type_id"
//                     disabled={mode === 'edit' ? true : false}
//                     labelKey="name"
//                     labelInValue
//                     className="w-full"
//                     onChange={(selected) => {
//                       if (selected?.value) {
//                         dispatch(getAccountsList({ gl_type_id: selected.value }));
//                         setAccountType(selected);
//                         setSelectedGlTypeId(selected.value);
//                         dispatch(getHeadAccountList({ gl_type_id: selected.value }));
//                       } else {
//                         setShouldSyncData(false);
//                         setData([]);
//                         setSelectedGlTypeId(null);
//                       }
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
// =======
//         <Row gutter={16} style={{ display: 'flex', flexDirection: 'row' }}>
//           <Col span={8}>
//             <Form.Item name="gl_types" label="Account Type">
//               <AsyncSelectLedger
//                 endpoint="/lookups/gl-types"
//                 valueKey="gl_type_id"
//                 labelKey="name"
//                 labelInValue
//                 className="w-full"
//                 onChange={(selected) => {
//                   if (selected?.value) {
//                     setAccountType(selected?.value);
//                     form.setFieldsValue({ head_account: undefined });
//                   } else {
//                     setShouldSyncData(false);
//                     setData([])
//                     form.setFieldsValue({ head_account: undefined });
//                   }
//                 }}
//               />
//             </Form.Item>
//             <Form.Item name="account_code" label="Account Number" preserve={false}>
//               <Input
//                 required
//                 allowClear
//                 inputMode="numeric"
//                 onKeyDown={(e) => {
//                   if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
//                     e.preventDefault();
//                   }
//                 }}
//                 onPaste={(e) => {
//                   e.preventDefault();
//                   let pasteData = e.clipboardData.getData("text");
//                   pasteData = pasteData.slice(0, 3);
//                   const numbersOnly = pasteData.replace(/\D/g, "");
//                   if (numbersOnly) {
//                     const input = e.target;
//                     const start = input.selectionStart;
//                     const end = input.selectionEnd;
// >>>>>>> ledger

//               <Col span={24} sm={12} md={8} lg={12}>
//                 <Form.Item name="account_code" label="Account Number">
//                   <Input
//                     required
//                     allowClear
//                     disabled={mode === 'edit' ? true : false}
//                     inputMode="numeric"
//                     onKeyDown={(e) => {
//                       if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
//                         e.preventDefault();
//                       }
//                     }}
//                     onPaste={(e) => {
//                       e.preventDefault();
//                       let pasteData = e.clipboardData.getData("text");
//                       pasteData = pasteData.slice(0, 3);
//                       const numbersOnly = pasteData.replace(/\D/g, "");
//                       if (numbersOnly) {
//                         const input = e.target;
//                         const start = input.selectionStart;
//                         const end = input.selectionEnd;

//                         const newValue =
//                           input.value.substring(0, start) +
//                           numbersOnly +
//                           input.value.substring(end);

// <<<<<<< HEAD
//                         input.value = newValue.slice(0, 3);

//                         const event = new Event("input", { bubbles: true });
//                         input.dispatchEvent(event);
//                       }
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={24} sm={12} md={8} lg={12}>
//                 <Form.Item name="coa_name" label="Account Name">
//                   <Input required />
//                 </Form.Item>
//               </Col>


//               <Col span={24} sm={12} md={8} lg={12}>
//                 <Form.Item name="head_account" label="Head Account"> {/* pl statement */}
//                   <AsyncSelectLedger
//                     endpoint={`/accounts/account/heads?gl_type_id=${accountType?.value || ''}`}
//                     valueKey="head_account_id"
//                     disabled={mode === 'edit' ? true : false}
//                     labelKey="head_account_name"
//                     labelInValue
//                     className="w-full"
//                     onChange={(selected) => {
//                       form.setFieldsValue({ head_account: selected });
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
// =======
//                     const event = new Event("input", { bubbles: true });
//                     input.dispatchEvent(event);
//                   }
//                 }}
//               />
//             </Form.Item>
//             <Form.Item name="coa_name" label="Account Name" preserve={false}>
//               <Input required />
//             </Form.Item>
//             <Form.Item name="parent_account" label="Parent Account">
//               <AsyncSelectLedgerParent
//                 endpoint="/accounts"
//                 valueKey="account_id"
//                 labelKey="name"
//                 labelInValue
//                 className="w-full"
//                 onChange={(selected) => {
//                   if (!selected?.value) return;

//                   if (selected?.value) {
//                     const parentAcc = selected?.data;
//                     setAccountType(parentAcc?.gl_type_id)
//                     form.setFieldsValue({
//                       gl_types: {
//                         value: parentAcc.gl_type_id,
//                         label: parentAcc.gl_type,
//                       },
//                       head_account: {
//                         value: parentAcc.head_account_id,
//                         label: parentAcc.head_account_name,
//                       },
//                     });
//                   }
//                 }}
//               />
//             </Form.Item>
//             {/* <Form.Item name="head_account" label="Head Account">
//               <AsyncSelectLedgerParent
//                 key={accountType}
//                 endpoint={`/accounts/account/heads?gl_type_id=${accountType || ''}`}
//                 valueKey="head_account_id"
//                 labelKey="head_account_name"
//                 labelInValue
//                 className="w-full"
//                 onChange={(selected) => {
//                   form.setFieldsValue({ head_account: selected?.value ? selected : null });
//                 }}
//               />
//             </Form.Item> */}
//           </Col>
//           {/* </Row> */}
//           {/* <Row>
//           <Col span={24}>
//             <h1>Your Table Title</h1>
//           </Col>
//         </Row> */}
//           {/* <Row> */}
//           {/* <Col span={16}>
//             <h1>Your Table Title</h1>
//             <div>
//               {isListLoading ? (
//                 <div className="flex min-h-32 items-center justify-center">
//                   <Spin />
//                 </div>
//               ) : (
//                 <Table
//                   columns={columns}
//                   dataSource={data}
//                   rowKey={'head_account_id'}
//                   size="small"
//                   // scroll={{ x: 'calc(100% - 200px)' }}
//                   scroll={{
//                     x: 'max-content', // let table use full column widths
//                     y: 350            // vertical scroll inside container
//                   }}
//                   pagination={false}
//                 // scroll={{
//                 //   y: 350,
//                 //   x: 'max-content'
//                 // }}
//                 />
//               )}
//             </div>
//           </Col> */}
//         </Row>
//       </Form >

//       {/* {isListLoading ? (
//           <div className="flex min-h-32 items-center justify-center">
//             <Spin />
// >>>>>>> ledger
//           </div>
//           <div>

//             {/* Accounts Tree View */}
//             {(selectedGlTypeId || selectedParentAccountId) && (
//               <AccountsTree
//                 treeData={accountsTree}
//                 loading={isTreeLoading}
//                 onSelect={(node) => {
//                   if (mode !== 'edit' && node) {
//                     // Set form values directly
//                     form.setFieldsValue({
//                       gl_types: { value: node.gl_type_id, label: node.gl_type_name },   // assuming backend returns name
//                       parent_account: { value: node.account_id, label: node.name },
//                       head_account: { value: node.head_account_id, label: node.head_account_name },
//                     });

//                     // Also sync state so dependent queries work
//                     if (node.gl_type_id) {
//                       setSelectedGlTypeId(node.gl_type_id);
//                     }
//                     if (node.parent_account_id) {
//                       setSelectedParentAccountId(node.parent_account_id);
//                     }
//                   }
//                 }}
//               />
//             )}
//           </div>
//         </div>

//       <div className="mt-4 flex items-center justify-end gap-2">
//         <Link to="/general-ledger/accounts">
//           <Button className="w-28">Exit</Button>
//         </Link>

//         <Button
//           type="primary"
//           className="w-28"
//           loading={isFormSubmitting && submitAction === 'save'}
//           onClick={() => {
//             setSubmitAction('save');
//             form.submit()
//           }}>
//           Save
//         </Button>

//         <Button
//           type="primary"
//           className="w-28 bg-green-600 hover:!bg-green-500"
//           loading={isFormSubmitting && submitAction === 'saveAndExit'}
//           onClick={() => {
//             setSubmitAction('saveAndExit');
//             form.submit()
//           }}>
//           Save & Exit
//         </Button>

//       </div>
//     </>
//   );
// };

// export default CoaLevelForm;
/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Table, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getAccountsList,
  getAccountCode,
  // getHeadAccountList,
  getAccountsTree
} from '../../store/features/coaAccountsSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';
import AsyncSelectLedgerParent from '../AsyncSelectLedgerParent';
import DebounceInput from '../Input/DebounceInput';
import AccountsTree from '../Tree/AccountsTree';

const CoaLevelForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    isFormSubmitting,
    initialFormValues,
    initialFormCodeValues,
    isListLoading,
    // headAccountList,
    accountsTree,
    isTreeLoading
  } = useSelector((state) => state.coaAccounts);

  const [submitAction, setSubmitAction] = useState(null);
  const [data, setData] = useState([]);
  const [shouldSyncData, setShouldSyncData] = useState(true);
  const [accountType, setAccountType] = useState(null);
  const [selectedGlTypeId, setSelectedGlTypeId] = useState(null);
  const [selectedParentAccountId, setSelectedParentAccountId] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const onFinish = (values) => {
    const data = {
      gl_type_id: values?.gl_types?.value || null,
      parent_account_id: values?.parent_account?.value || null,
      name: values?.coa_name || null,
      // head_account_id: values?.head_account?.value || null,
      account_code: values?.account_code || null
    };
    if (submitAction === 'save') {
      onSubmit(data);
    } else if (submitAction === 'saveAndExit') {
      onSave(data);
    }
  };

  useEffect(() => {
    setInitialData(initialFormValues);
    // if (shouldSyncData) {
    // setData(Array.isArray(headAccountList) ? headAccountList : []);
    // }
    if (mode === 'edit' && initialFormValues) {
      const gl_type_id = initialFormValues?.gl_type_id || '';
      const gl_types = initialFormValues?.gl_types || '';
      const parent_account_id = initialFormValues?.parent_account_id || '';
      const parent_account_name = initialFormValues?.parent_account_name || '';
      const code = (initialFormValues?.code || '').toString().replace(/\D/g, '');
      const coa_name = initialFormValues?.coa_name || '';

      form.setFieldsValue({
        gl_types: gl_type_id ? { value: gl_type_id, label: gl_types } : undefined,
        parent_account: parent_account_id
          ? { value: parent_account_id, label: parent_account_name }
          : undefined,
        code,
        coa_name,
        account_code: initialFormValues?.account_code || '',
        // head_account: initialFormValues?.head_account_id
        // ? { value: initialFormValues.head_account_id, label: initialFormValues.head_account_name }
        // : undefined
      });

      if (gl_type_id) {
        setSelectedGlTypeId(gl_type_id);
        dispatch(getAccountsList({ gl_type_id }));
      }
      if (parent_account_id) {
        setSelectedParentAccountId(parent_account_id);
      }
    } else if (mode !== 'edit' && initialFormCodeValues) {
      form.setFieldsValue({
        code: (initialFormCodeValues?.code || '').toString().replace(/\D/g, '')
      });
    }
    // }, [initialFormValues, initialFormCodeValues, mode, form, dispatch, shouldSyncData, headAccountList]);
  }, [initialFormValues, initialFormCodeValues, mode, form, dispatch, shouldSyncData]);

  useEffect(() => {
    // if (selectedGlTypeId || selectedParentAccountId) {
      dispatch(
        getAccountsTree({
          gl_type_id: selectedGlTypeId,
          parent_account_id: selectedParentAccountId
        })
      );
    // }
  }, [selectedGlTypeId, selectedParentAccountId, dispatch]);

  const columns = [
    {
      title: 'Sr.',
      render: (_, __, index) => <>{index + 1}.</>,
      width: 35
    },
    {
      title: 'Account Type',
      dataIndex: 'gl_type',
      render: (_, record) => <DebounceInput disabled value={record?.gl_type} />,
      width: 100
    },
    {
      title: 'Account Number',
      dataIndex: 'account_code',
      render: (_, record) => <Input value={String(record?.account_code || '').replace(/\D/g, '')} disabled />,
      width: 100
    },
    {
      title: 'Account Name',
      dataIndex: 'name',
      render: (_, record) => <Input value={record.name} disabled />,
      width: 150
    },
    {
      title: 'Parent Account',
      dataIndex: 'parent_account_name',
      render: (_, record) => <Input value={record?.parent_account_name} />,
      width: 150
    },
    // {
    //   title: 'Head Account',
    //   dataIndex: 'head_account_name',
    //   render: (_, record) => <Input value={record?.head_account_name} disabled />,
    //   width: 150
    // }
  ];

  return (
    <>
      <Form
        name="coaAccounts"
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        initialValues={mode === 'edit' ? { ...initialData } : {}}
        scrollToFirstError
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 '>
          <div>


            <Row gutter={16}>
               <Col span={24}>
                <Form.Item name="parent_account" label="Parent Account">
                  <AsyncSelectLedgerParent
                    endpoint="/accounts"
                    valueKey="account_id"
                    labelKey="name"
                    labelInValue
                    className="w-full"
                    onChange={(selected) => {
                      // if (!selected?.value) return;
                      const parentAcc = selected?.data;
                      setAccountType(parentAcc?.gl_type_id);
                      form.setFieldsValue({
                        gl_types: {
                          value: parentAcc.gl_type_id,
                          label: parentAcc.gl_type
                        },
                        // head_account: {
                        //   value: parentAcc.head_account_id,
                        //   label: parentAcc.head_account_name
                        // }
                      });
                      setSelectedParentAccountId(selected.value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="gl_types" label="Account Type">
                  <AsyncSelectLedger
                    endpoint="/lookups/gl-types"
                    valueKey="gl_type_id"
                    labelKey="name"
                    labelInValue
                    disabled={mode === 'edit'}
                    className="w-full"
                    onChange={(selected) => {
                      if (selected?.value) {
                        setAccountType(selected);
                        setSelectedGlTypeId(selected.value);
                        dispatch(getAccountsList({ gl_type_id: selected.value }));
                        // dispatch(getHeadAccountList({ gl_type_id: selected.value }));
                      } else {
                        setShouldSyncData(false);
                        setData([]);
                        setSelectedGlTypeId(null);
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="account_code" label="Account Number">
                  <Input
                    required
                    allowClear
                    disabled={mode === 'edit'}
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      let pasteData = e.clipboardData.getData('text').slice(0, 3);
                      const numbersOnly = pasteData.replace(/\D/g, '');
                      if (numbersOnly) {
                        const input = e.target;
                        const start = input.selectionStart;
                        const end = input.selectionEnd;
                        const newValue = input.value.substring(0, start) + numbersOnly + input.value.substring(end);
                        input.value = newValue.slice(0, 3);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="coa_name" label="Account Name">
                  <Input required />
                </Form.Item>
              </Col>
             
            </Row>
          </div>
          {(
            <AccountsTree
              treeData={accountsTree}
              loading={isTreeLoading}
              onSelect={(node) => {
                if (mode !== 'edit' && node) {
                  form.setFieldsValue({
                    gl_types: { value: node.gl_type_id, label: node.gl_type_name },
                    parent_account: { value: node.account_id, label: node.name },
                    // head_account: { value: node.head_account_id, label: node.head_account_name }
                  });
                  if (node.gl_type_id) setSelectedGlTypeId(node.gl_type_id);
                  if (node.parent_account_id) setSelectedParentAccountId(node.parent_account_id);
                }
              }}
            />
          )}
        </div>
      </Form>



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
            form.submit();
          }}
        >
          Save
        </Button>
        <Button
          type="primary"
          className="w-28 bg-green-600 hover:!bg-green-500"
          loading={isFormSubmitting && submitAction === 'saveAndExit'}
          onClick={() => {
            setSubmitAction('saveAndExit');
            form.submit();
          }}
        >
          Save & Exit
        </Button>
      </div>
    </>
  );
};

export default CoaLevelForm;
