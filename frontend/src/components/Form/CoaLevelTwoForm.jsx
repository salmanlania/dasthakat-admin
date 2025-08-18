/* eslint-disable react/prop-types */
import { Button, Col, Form, Input, Row, Table, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCoaLevelTwo, getCoaLevelTwoCode } from '../../store/features/coaTwoSlice';
import AsyncSelectLedger from '../AsyncSelectLedger';

const CoaLevelTwoForm = ({ mode, onSubmit, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormSubmitting, initialFormValues, coaLevelTwoList, initialFormCodeValues, isListLoading } = useSelector(
    (state) => state.coaTwo
  );
  const [submitAction, setSubmitAction] = useState(null);

  const onFinish = (values) => {
    const data = {
      coa_level1_id: values?.gl_types?.value ? values?.gl_types?.value : null,
      level2_code: values?.code ? values?.code : null,
      name: values?.coa_name ? values?.coa_name : null,
    };

    submitAction === 'save' ? onSubmit(data) : submitAction === 'saveAndExit' ? onSave(data) : null;
  };

  useEffect(() => {
    if (mode === 'edit' && initialFormValues) {
      const gl_types = initialFormValues?.gl_types || '';
      const level2_code = initialFormValues?.coa_level1_id || '';
      const code = (initialFormValues?.level2_code || '').toString().replace(/\D/g, '');
      const coa_name = initialFormValues?.coa_name || '';
      form.setFieldsValue({
        gl_type_id: initialFormValues?.coa_level1_id
          ? { value: initialFormValues?.coa_level1_id, label: gl_types }
          : undefined,
        code: code,
        coa_name: coa_name,
      });

      if (initialFormValues?.coa_level1_id) {
        dispatch(getCoaLevelTwo({ gl_type_id: initialFormValues?.coa_level1_id }));
      }
    } else if (mode !== 'edit' && initialFormCodeValues) {
      form.setFieldsValue({
        code: (initialFormCodeValues?.code || '').toString().replace(/\D/g, '')
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
      dataIndex: 'gl_type',
      key: 'gl_type',
      render: (_, record, index) => {
        return (
          <Input
            disabled
            value={record?.level1_display_name}
          />
        );
      },
      width: 140
    },
    {
      title: 'Code',
      dataIndex: 'level2_code',
      key: 'level2_code',
      render: (_, record, { product_id }, index) => {
        const cleanValue = String(record.level2_code || '').replace(/\D/g, '');
        return (
          <Input type='number' value={cleanValue} disabled />
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
        name="LevelTwo"
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
          <Col span={24} sm={12} md={8} lg={8}>
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
                    dispatch(getCoaLevelTwo({ coa_level1_id: selected.value }));
                    if (mode !== 'edit') {
                      dispatch(getCoaLevelTwoCode(
                        {
                          gl_type_id: null,
                          level: 2,
                          coa_level2_id: null,
                          coa_level1_id: selected.value
                        }
                      ));
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={12} md={4} lg={4}>
            <Form.Item name="code" label="Code">
              <Input
                required
                disabled={mode === 'edit' ? true : false}
                inputMode="numeric"
                maxLength={3}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Tab") {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasteData = e.clipboardData.getData("text");
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
          <Col span={24} sm={12} md={12} lg={12}>
            <Form.Item name="coa_name" label="Name">
              <Input required />
            </Form.Item>
          </Col>
        </Row>
        {isListLoading ? (
          <div className="flex min-h-32 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={Array.isArray(coaLevelTwoList) ? coaLevelTwoList : []}
            rowKey={'coa_level1_id'}
            size="small"
            scroll={{ x: 'calc(100% - 200px)' }}
            pagination={false}
            sticky={{
              offsetHeader: 56
            }}
          />
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/general-ledger/coa/level2">
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

export default CoaLevelTwoForm;