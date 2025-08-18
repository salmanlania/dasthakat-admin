/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Table, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCoaLevelThree, getCoaLevelThreeCode } from '../../store/features/coaThreeSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';

const CoaLevelThreeForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, coaLevelThreeList, initialFormCodeValues, isItemLoading } = useSelector(
    (state) => state.coaThree
  );

  const [submitAction, setSubmitAction] = useState(null);

  const onFinish = (values) => {

    const data = {
      coa_level1_id: values?.gl_types?.value ? values?.gl_types?.value : null,
      coa_level2_id: values?.level2_code?.value ? values?.level2_code?.value : null,
      level3_code: values?.level3_code ? values?.level3_code : null,
      name: values?.coa_name ? values?.coa_name : null,
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const level1_code = initialFormValues?.coa_level1 || '';
      const level2_code = initialFormValues?.coa_level2 || '';
      const code = (initialFormValues?.level3_code || '').toString().replace(/\D/g, '');
      const coa_name = initialFormValues?.coa_name || '';
      form.setFieldsValue({
        level2_code: level2_code,
        gl_types: level1_code,
        level3_code: code,
        coa_name: coa_name,
      });

      if (level2_code || level1_code) {
        dispatch(getCoaLevelThree({ level2_code: level2_code }));
      }
    } else if (mode !== 'edit') {
      form.setFieldsValue({
        level3_code: (initialFormCodeValues?.code || '').toString().replace(/\D/g, '')
      });
    }
  }, [initialFormValues, initialFormCodeValues, form, mode]);

  const columns = [
    {
      title: 'Sr.',
      dataIndex: 'sr',
      key: 'sr',
      render: (_, record, index) => {
        return <>{index + 1}.</>;
      },
      width: 20
    },
    {
      title: 'Level 1',
      dataIndex: 'coa_level1_name',
      key: 'coa_level1_name',
      render: (_, record, index) => {
        return (
          <Input
            disabled
            value={record?.level1_display_name ? record?.level1_display_name : record?.coa_level1_name || ""}
          />
        );
      },
      width: 140
    },
    {
      title: 'Level 2',
      dataIndex: 'coa_level2_name',
      key: 'coa_level2_name',
      render: (_, record, index) => {
        return (
          <Input
            disabled
            value={record?.level2_display_name ? record?.level2_display_name : record?.coa_level2_name || ""}
          />
        );
      },
      width: 140
    },
    {
      title: 'Code',
      dataIndex: 'level3_code',
      key: 'level3_code',
      render: (_, record, { product_id }, index) => {
        const cleanValue = String(record.level3_code || '').replace(/\D/g, '');
        return (
          <Input value={cleanValue} disabled />
        );
      },
      width: 100
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record, { product_id }, index) => {
        return (
          <Input value={record.name} disabled />
        );
      },
      width: 280
    },
  ];

  return (
    <>
      <Form
        name="LevelThree"
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

        <Row gutter={12}>
          <Col span={24} sm={12} md={6} lg={6}>
            <Form.Item name="gl_types" label="Level 1">
              <AsyncSelectLedger
                endpoint="/coa-level1?id=name"
                valueKey="coa_level1_id"
                labelKey="name"
                labelInValue
                className="w-full"
                disabled={mode === 'edit' ? true : false}
                onChange={(selected) => {
                  if (selected?.value) {
                    dispatch(getCoaLevelThree({ coa_level1_id: selected.value }));
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={6} lg={6}>
            <Form.Item name="level2_code" label="Level 2">
              <AsyncSelectLedger
                endpoint="/coa-level2?id=name"
                valueKey="coa_level2_id"
                labelKey="name"
                labelInValue
                className="w-full"
                required
                disabled={mode === 'edit' ? true : false}
                onChange={async (selected) => {

                  if (selected?.value) {
                    try {
                      const res = await dispatch(getCoaLevelThree({ coa_level2_id: selected.value })).unwrap();

                      if (Array.isArray(res.data) && res.data.length > 0) {
                        form.setFieldsValue({
                          gl_types: {
                            value: res.data[0].coa_level1_id,
                            label: res.data[0].coa_level1_name
                          }
                        });
                      }

                      if (mode !== 'edit') {
                        dispatch(getCoaLevelThreeCode({
                          gl_type_id: null,
                          level: 3,
                          coa_level2_id: selected.value,
                          coa_level1_id: null
                        }));
                      }
                    } catch (error) {
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={4} lg={4}>
            <Form.Item name="level3_code" label="Code">
              <Input
                disabled={mode === 'edit' ? true : false}
                required
                inputMode="numeric"
                maxLength={3}
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
          <Col span={24} sm={12} md={8} lg={8}>
            <Form.Item name="coa_name" label="Name">
              <Input required />
            </Form.Item>
          </Col>
        </Row>
        {
          isItemLoading ? (
            <div className="flex min-h-32 items-center justify-center">
              <Spin />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={Array.isArray(coaLevelThreeList) ? coaLevelThreeList : []}
              rowKey={'coa_level3_id'}
              size="small"
              scroll={{ x: 'calc(100% - 200px)' }}
              pagination={false}
              sticky={{
                offsetHeader: 56
              }}
            />
          )
        }

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/coa/level3">
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

export default CoaLevelThreeForm;