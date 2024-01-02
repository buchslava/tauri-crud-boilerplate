import { Tabs, TabsProps } from "antd";
import "./App.css";
import Person from "./Person";
import TodoContainer from "./TodoContainer";
import Data from "./Data";

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
  return <Tabs items={tabs} />;
}

export default App;
