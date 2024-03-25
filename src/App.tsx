import { Tabs, TabsProps } from "antd";
import "./App.css";
import Person from "./Person";
import TodoContainer from "./TodoContainer";
import Data from "./Data";
import { useGlobalContext } from "./GlobalContext";

const tabs: TabsProps["items"] = [
  {
    key: "persons",
    label: "Persons",
    children: <Person />,
  },
  {
    key: "todo",
    label: "Todo",
    children: <TodoContainer />,
  },
  {
    key: "data",
    label: "Data",
    children: <Data />,
  },
];

function App() {
  const { refreshPerson, refreshTodo } = useGlobalContext();

  return (
    <Tabs
      items={tabs}
      onTabClick={(key: string) => {
        if (key === "persons") {
          refreshPerson();
        }
        if (key === "todo") {
          refreshTodo();
        }
      }}
    />
  );
}

export default App;
