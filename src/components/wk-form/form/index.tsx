import {
  ForwardedRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Form } from "@tarojs/components";
import { FormContextProvider } from "../context";
import { FormModel, FormProps } from "../model/FormModel";

export const WKForm = forwardRef<FormModel, FormProps>(
  (props, ref: ForwardedRef<FormModel>) => {
    const { value } = props;

    const model = useMemo(() => {
      return new FormModel(props);
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return model;
      },
      [model],
    );

    useEffect(() => {
      model.updateProps(props);
    }, [value, props]);

    const handleSubmit = () => {
      model.validate();
    };

    return (
      <FormContextProvider model={model}>
        <Form onSubmit={handleSubmit}>{props.children}</Form>
      </FormContextProvider>
    );
  },
);
