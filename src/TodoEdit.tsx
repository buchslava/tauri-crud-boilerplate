import dayjs from "dayjs";
import {
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Form,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import locale from "antd/locale/en_US";

const DATE_FORMAT = "YYYY-MM-DD";

const TodoEdit = forwardRef((props: any, ref: Ref<void>) => {
  const [form] = Form.useForm();
  const [dateValue, setDateValue] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    setDateValue(dayjs(props.currentRecord.date));
    form.setFieldsValue(props.currentRecord);
  }, [props.currentRecord]);

  useImperativeHandle(ref, () => ({
    submit() {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        date: dateValue?.format(DATE_FORMAT),
      });
      form.submit();
    },
  }));

  const onFinish = (values: any) => {
    props.handleEditOk(values);
    form.resetFields();
  };

  const onDateChange: DatePickerProps["onChange"] = (_, dateString) => {
    if (dateString) {
      setDateValue(dayjs(dateString));
      form.setFieldsValue({ ...form.getFieldsValue(), date: dateString });
    }
  };

  return (
    <Form form={form} initialValues={props.currentRecord} onFinish={onFinish}>
      <Form.Item name="date">
        <ConfigProvider locale={locale}>
          <DatePicker
            autoFocus
            value={dateValue}
            format={DATE_FORMAT}
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
