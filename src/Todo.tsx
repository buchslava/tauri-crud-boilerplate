import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  message,
  Divider,
  Checkbox,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import TodoEdit from "./TodoEdit";
import { apiCall } from "./util";
import { useGlobalContext } from "./GlobalContext";

interface DataType {
  key?: React.Key;
  id?: number;
  notes: string;
  completed: boolean;
}

export default function Todo({ personId }: { personId: number }) {
  const { refreshDescriptor, refreshTodo } = useGlobalContext();
  const [editVisible, setEditVisible] = useState(false);
  const [columns, setColumns] = useState<ColumnsType<DataType>>();
  const [data, setData] = useState<DataType[]>([]);
  const editFormRef = useRef<any>();
  const [currentRecord, setCurrentRecord] = useState<DataType>();
  const [errorMessage, errorMessageHolder] = message.useMessage();

  const doDelete = async (id: number) => {
    try {
      await apiCall("todo_delete", { id });
      refreshTodo();
    } catch (e) {
      setEditVisible(false);
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't delete todo",
      });
    }
  };
  const doEdit = (record: any) => {
    setCurrentRecord({ ...record });
    setEditVisible(true);
  };

  const load = async () => {
    try {
      const result = await apiCall("todo_select", { personId });
      const items = JSON.parse(JSON.parse(result as unknown as string));
      setData(
        items.map((item: any) => ({
          ...item,
          key: item.id,
          completed: !!item.completed,
        }))
      );
    } catch (e) {
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't load todo",
      });
    }
  };

  useEffect(() => {
    if (!personId) {
      return;
    }
    setColumns([
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        fixed: "left",
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        fixed: "left",
      },
      {
        title: "Completed",
        dataIndex: "completed",
        key: "completed",
        fixed: "left",
        render: (_, record: DataType) => (
          <Checkbox checked={record.completed} />
        ),
      },
      {
        title: "...",
        dataIndex: "operation",
        width: 130,
        fixed: "right",
        render: (_, record: DataType) => (
          <>
            <a
              href="#"
              onClick={() => {
                doEdit(record);
              }}
            >
              Edit
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="Delete staff"
              onConfirm={() => doDelete(record.id as number)}
            >
              <a>Delete</a>
            </Popconfirm>
          </>
        ),
      },
    ]);
    load();
  }, [personId, refreshDescriptor.todo]);

  const doEditOk = () => {
    editFormRef.current.submit();
  };

  const handleEditOk = async (formData: DataType) => {
    try {
      const body = {
        ...formData,
        personId,
        completed: formData.completed === false ? 0 : 1,
      };
      if (currentRecord?.id) {
        await apiCall("todo_update", {
          ...body,
          id: currentRecord.id,
        });
      } else {
        await apiCall("todo_insert", body);
      }
      setEditVisible(false);
      refreshTodo();
    } catch (e) {
      setEditVisible(false);
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't update todo",
      });
    }
  };

  const handleEditCancel = () => {
    setEditVisible(false);
  };
  const addNewRow = () => {
    setCurrentRecord({ notes: "", completed: false });
    setEditVisible(true);
  };

  return !columns ? (
    <></>
  ) : (
    <div>
      {errorMessageHolder}
      <Button onClick={addNewRow} style={{ margin: 10 }}>
        New Todo
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: "calc(100vh - 200px)" }}
      />
      <Modal
        title="Todo"
        open={editVisible}
        onOk={doEditOk}
        onCancel={handleEditCancel}
      >
        <TodoEdit
          ref={editFormRef}
          currentRecord={currentRecord}
          handleEditOk={handleEditOk}
        ></TodoEdit>
      </Modal>
    </div>
  );
}
