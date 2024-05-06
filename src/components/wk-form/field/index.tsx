import React, { FC, useEffect, useMemo, useCallback } from "react";
import { observer } from "mobx-react";
import useDeepCompareEffect from "@/hooks/useDeepCompareEffect";
import { useFormContext } from "../context/FormContext";
import { FormItemModel, FormItemProps } from "../model";
import { getValueFromEvent } from "../utils";
import { LayoutType } from "../types";

export interface WKFieldContext {
  field: FormItemModel;
  label: any;
  value: any;
  required: boolean;
  error?: string;
  layout?: LayoutType;
  onChange: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
}

interface FieldProps extends FormItemProps {
  children?: (WKFieldContext) => React.ReactNode;
}

export const Field: FC<FieldProps> = observer((props) => {
  const form = useFormContext();

  if (form == null) {
    throw new Error("表单控件必须放置在表单容器内");
  }

  const field = useMemo(() => {
    return new FormItemModel(form, props);
  }, [form]);

  // 更新props参数
  useDeepCompareEffect(() => {
    field.updateProps(props);
  }, [props, form]);

  useEffect(() => {
    field.onMount();
    return field.onUnmount;
  }, [field]);

  const onChange = useCallback(
    (evt: any) => {
      return field.onChange(getValueFromEvent(evt));
    },
    [field],
  );

  const context: WKFieldContext = {
    field,
    label: field.label,
    value: field.value,
    required: !!field.required,
    onChange: onChange,
    onFocus: field.onFocus,
    onBlur: field.onBlur,
    error: field.validatorMessage,
    layout: field.layout,
  };

  return props.children?.(context) as React.ReactElement;
});
