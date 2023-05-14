import { makeAutoObservable } from 'mobx';
import { unset } from 'lodash';
import { RuleItem } from 'async-validator';
import { FormItemModel } from './FormItemModel';

import { FormValidationTrigger } from '../types';

export interface FormProps {
  value?: Record<string, any>;
  rules?: RuleItem[];
  children?: React.ReactNode;
  onSubmit?: (val: any) => void;
  validateTriggerType?: FormValidationTrigger;
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
    this.value = value ?? ({} as any);
    this.rules = rules;
    this.props = { ...props };
  }
  get fieldList() {
    return Object.keys(this.fields).map(k => this.fields[k]);
  }
  /**
   * 验证触发方式
   */
  get validateTriggerType(): FormValidationTrigger {
    return this.props.validateTriggerType ?? 'onChange';
  }
  getFieldValue(prop: string) {
    return this.value[prop];
  }
  addField(field: FormItemModel) {
    if (this.fields[field.prop]) {
      throw new Error(`Field ${field.prop} already exists, please unmount first`);
    }
    this.fields[field.prop] = field;
  }
  removeField(field: FormItemModel) {
    Reflect.deleteProperty(this.fields, field.prop);
    // 设置为 undefined
    unset(this.value, field.prop);
  }
  setFieldValue(path: string, val: any) {
    this.value[path] = val;
  }

  // submit = async () => {
  //   await this.validate();
  //   return this.value;
  // };

  async validate() {
    const promises = this.fieldList.map(field => field.validate());
    try {
      await Promise.all(promises);
      this.props.onSubmit?.(this.value);
      return true;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
