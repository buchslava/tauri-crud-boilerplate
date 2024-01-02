import { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import PersonEdit from "./PersonEdit";
import { apiCall } from "./util";

interface DataType {
  key?: React.Key;
  id?: number;
  name: string;
}

export default function Person() {
  const [editVisible, setEditVisible] = useState(false);
  const [columns, setColumns] = useState<ColumnsType<DataType>>();
  const [data, setData] = useState<DataType[]>([]);
  const editFormRef = useRef<any>();
  const [currentRecord, setCurrentRecord] = useState<DataType>();
  const [errorMessage, errorMessageHolder] = message.useMessage();

  const doDelete = async (id: number) => {
    try {
      await apiCall("person_delete", { id });
      load();
    } catch (e) {
      setEditVisible(false);
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't delete person",
      });
    }
  };
  const doEdit = (record: any) => {
    setCurrentRecord(record);
    setEditVisible(true);
  };

  const load = async () => {
    try {
      const result = await apiCall("person_select");
      const items = JSON.parse(JSON.parse(result as unknown as string));
      setData(
        items.map((item: any) => ({
          key: item.id,
          ...item,
        }))
      );
    } catch (e) {
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't delete person",
      });
    }
  };

  useEffect(() => {
    load();
    const columns: ColumnsType<DataType> = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        // sorter: (a, b) => a.l_name.length - b.skill_name.length,
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
            </a>{" "}
            |&nbsp;
            <Popconfirm
              title="Delete staff"
              onConfirm={() => doDelete(record.id as number)}
            >
              <a>Delete</a>
            </Popconfirm>
          </>
        ),
      },
    ];
    setColumns(columns);
  }, []);

  const doEditOk = () => {
    editFormRef.current.submit();
  };

  const handleEditOk = async (formData: DataType) => {
    try {
      if (currentRecord?.id) {
        await apiCall("person_update", {
          name: formData.name,
          id: currentRecord.id,
        });
      } else {
        await apiCall("person_insert", {
          name: formData.name,
        });
      }
      setEditVisible(false);
      load();
    } catch (e) {
      setEditVisible(false);
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't update person",
      });
    }
  };

  const handleEditCancel = () => {
    setEditVisible(false);
  };
  const addNewRow = () => {
    setCurrentRecord({ name: "" });
    setEditVisible(true);
  };

  return !columns ? (
    <></>
  ) : (
    <div>
      {errorMessageHolder}
      <Button onClick={addNewRow} style={{ margin: 10 }}>
        New Person
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: "calc(100vh - 200px)" }}
      />
      <Modal
        title="Person"
        open={editVisible}
        onOk={doEditOk}
        onCancel={handleEditCancel}
      >
        <PersonEdit
          ref={editFormRef}
          currentRecord={currentRecord}
          handleEditOk={handleEditOk}
        ></PersonEdit>
      </Modal>
    </div>
  );
}
