import { Form, Input } from "antd";
import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";

const PersonEdit = forwardRef((props: any, ref: Ref<void>) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(props.currentRecord);
  }, [props.currentRecord]);

  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    },
  }));

  const onFinish = (values: any) => {
    props.handleEditOk(values);
    form.resetFields();
  };

  return (
    <Form form={form} initialValues={props.currentRecord} onFinish={onFinish}>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input autoFocus placeholder="Name" />
      </Form.Item>
    </Form>
  );
});

export default PersonEdit;
