import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

class Model {
  value: Record<string, any> = {};
  constructor() {
    makeAutoObservable(this);
  }
}
const model = new Model();

export default model;

const context = createContext(model);

export function useStore() {
  return useContext(context);
}
