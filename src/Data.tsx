import { Button, Result } from "antd";
import { useEffect, useState } from "react";
import { apiCall } from "./util";

export default function Data() {
  const [result, setResult] = useState<[string, boolean] | undefined>();

  const getCall = (funName: string) => async () => {
    try {
      const newMessage = await apiCall(funName);
      setResult([newMessage as unknown as string, false]);
    } catch (e) {
      console.error(e);
      setResult([`${e}`, true]);
    }
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <>
      <div>
        <Button onClick={getCall("create_tables")}>Create DB</Button>
        <Button onClick={getCall("fill_tables")}>Fill DB</Button>
      </div>
      {result !== undefined && (
        <Result
          status={result[1] === true ? "error" : "success"}
          title={result[0]}
        />
      )}
    </>
  );
}
