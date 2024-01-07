import { Tabs, TabsProps, message } from "antd";
import { useEffect, useState } from "react";
import { apiCall } from "./util";
import Todo from "./Todo";
import { useGlobalContext } from "./GlobalContext";

export default function TodoContainer() {
  const { refreshDescriptor } = useGlobalContext();
  const [errorMessage, errorMessageHolder] = message.useMessage();
  const [tabs, setTabs] = useState<TabsProps["items"]>([]);

  const loadPersons = async () => {
    try {
      const result = await apiCall("person_select");
      const items = JSON.parse(JSON.parse(result as unknown as string));
      setTabs(
        items.map((item: any) => ({
          key: item.id,
          label: item.name,
          children: <Todo personId={item.id} />,
        }))
      );
    } catch (e) {
      console.error(e);
      errorMessage.open({
        type: "error",
        content: "Can't get persons",
      });
    }
  };

  useEffect(() => {
    loadPersons();
  }, [refreshDescriptor.person]);

  return (
    <>
      {errorMessageHolder}
      <Tabs tabPosition={"left"} items={tabs} />
    </>
  );
}
