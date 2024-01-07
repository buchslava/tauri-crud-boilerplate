import React, { createContext, useContext, useState } from "react";

export interface DataRefreshDescriptor {
  person: Date;
  todo: Date;
}

type GlobalContextProps = {
  refreshDescriptor: DataRefreshDescriptor;
  refreshPerson: () => void;
  refreshTodo: () => void;
};

const GlobalContext = createContext({} as GlobalContextProps);

export type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const now = new Date();
  const [refreshDescriptor, setRefreshDescriptor] =
    useState<DataRefreshDescriptor>({
      person: now,
      todo: now,
    });

  const refreshPerson = () => {
    setRefreshDescriptor({ ...refreshDescriptor, person: new Date() });
  };

  const refreshTodo = () => {
    setRefreshDescriptor({ ...refreshDescriptor, todo: new Date() });
  };

  return (
    <GlobalContext.Provider
      value={{
        refreshDescriptor,
        refreshPerson,
        refreshTodo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
