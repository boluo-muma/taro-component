import { makeAutoObservable } from "mobx";
import { unset } from "lodash";
import { RuleItem } from "async-validator";
import { FormItemModel } from "./FormItemModel";

import { FormValidationTrigger, LayoutType } from "../types";
import { getValidValue } from "../utils";

export interface FormProps {
  value?: Record<string, any>;
  rules?: RuleItem[];
  children?: React.ReactNode;
  onSubmit?: (val: any) => void;
  onChange?: (prop: string, val: any) => void;
  validateTriggerType?: FormValidationTrigger;
  layout?: LayoutType;
}

export class FormModel {
  value!: Record<string, any>;
  /** formItem组件状态 */
  fields: { [key: string]: any } = {};
  rules?: RuleItem[] = [];
  props: FormProps;
  validated: boolean = false;

  constructor(props: FormProps) {
    makeAutoObservable(this);
    const { value, rules } = props;
    this.value = getValidValue(value);
    this.rules = rules;
    this.props = { ...props };
  }
  get fieldList() {
    return Object.keys(this.fields).map((k) => this.fields[k]);
  }
  /**
   * 验证触发方式
   */
  get validateTriggerType(): FormValidationTrigger {
    return this.props.validateTriggerType ?? "onChange";
  }
  getFieldValue(prop: string) {
    return this.value[prop];
  }
  addField(field: FormItemModel) {
    if (this.fields[field.prop]) {
      throw new Error(
        `Field ${field.prop} already exists, please unmount first`,
      );
    }
    this.fields[field.prop] = field;
  }
  removeField(field: FormItemModel) {
    Reflect.deleteProperty(this.fields, field.prop);
    // 设置为 undefined
    unset(this.value, field.prop);
  }
  /**
   * 设置值，一般是form-item调用
   * @param path
   * @param val
   */
  setFieldValue(path: string, val: any) {
    this.value[path] = val;
    this.props.onChange?.(path, val);
  }
  updateProps(props: FormProps) {
    let dirty = false;
    if (props.value !== this.props.value) {
      dirty = true;
      this.value = getValidValue(props.value);
    }
    
    this.props = { ...props };
  }

  async validate() {
    const promises = this.fieldList.map((field) => field.validate());
    await Promise.all(promises);
    this.props.onSubmit?.(this.value);
  }
}
