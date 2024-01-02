import dayjs from "dayjs";
import {
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Form,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import locale from "antd/locale/en_US";

const TodoEdit = forwardRef((props: any, ref: Ref<void>) => {
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

  const onDateChange: DatePickerProps["onChange"] = (_, dateString) => {
    form.setFieldsValue({ ...form.getFieldsValue(), date: dateString });
  };

  return (
    <Form form={form} initialValues={props.currentRecord} onFinish={onFinish}>
      <Form.Item name="date" rules={[{ required: true }]}>
        <ConfigProvider locale={locale}>
          <DatePicker
            autoFocus
            defaultValue={dayjs(props.date)}
            format={"YYYY-MM-DD"}
            onChange={onDateChange}
          />
        </ConfigProvider>
      </Form.Item>
      <Form.Item name="completed">
        <Switch checkedChildren="Completed" unCheckedChildren="Uncompleted" />
      </Form.Item>
      <Form.Item name="notes" rules={[{ required: true }]}>
        <TextArea autoFocus placeholder="Notes" rows={5} />
      </Form.Item>
    </Form>
  );
});

export default TodoEdit;
