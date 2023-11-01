import React, { FC, useContext } from 'react';
import { FormModel } from '../model/FormModel';

const Context = React.createContext<FormModel | null>(null);

export const FormContextProvider: FC<{ model: FormModel; children?: React.ReactNode }> = props => {
  const { children, model } = props;
  return <Context.Provider value={model}>{children}</Context.Provider>;
};

export function useFormContext() {
  return useContext(Context);
}
