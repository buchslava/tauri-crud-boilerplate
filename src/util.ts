import { invoke } from "@tauri-apps/api/tauri";

export const apiCall = async (
  name: string,
  parameters: any = {}
): Promise<any> =>
  new Promise((resolve, reject) =>
    invoke(name, parameters).then(resolve).catch(reject)
  );

export const onlyUnique = <T>(value: T, index: number, array: T[]) =>
  array.indexOf(value) === index;
