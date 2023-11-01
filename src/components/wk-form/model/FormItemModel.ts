import ValidatorSchema, { RuleItem } from "async-validator";
import { makeAutoObservable } from "mobx";
import { FormModel } from "./FormModel";
import { FormValidationTrigger } from "../types";

export interface FormItemProps {
  label?: string;
  prop: string;
  rules?: RuleItem[];
  required?: boolean;
  validateTriggerType?: FormValidationTrigger;
  onChangePropsName?: string;
}

export class FormItemModel {
  form: FormModel;
  validatorState: "success" | "error" | string | null = "";
  validatorMessage?: string = "";
  props: FormItemProps;
  mounted: boolean = false;

  constructor(from: FormModel, props: FormItemProps) {
    this.form = from;
    this.props = { ...props };
    makeAutoObservable(this);
  }
  private resetState() {
    this.validatorMessage = "";
    this.validatorState = null;
  }
  get prop() {
    return this.props.prop;
  }
  get label() {
    return this.props.label;
  }
  get validateTriggerType() {
    return (
      this.props.validateTriggerType ||
      this.form.validateTriggerType ||
      "onChange"
    );
  }
  get required() {
    if (this.props.required) return true;
    if (this.props.rules) this.props.rules.some((item) => item.required);
  }
  get value() {
    return this.form.getFieldValue(this.prop);
  }
  onFocus = () => {
    this.validateIfNeeded("onFocus");
  };

  onBlur = () => {
    this.validateIfNeeded("onBlur");
  };

  /**
   * 触发校验
   * @param triggerType
   */
  private validateIfNeeded(triggerType: FormValidationTrigger) {
    if (this.validateTriggerType === triggerType) {
      Promise.resolve().then(() => {
        this.validate();
      });
    }
  }
  /**
   * 直接设置值
   * @param value
   */
  setValue(value: any) {
    this.form.setFieldValue(this.prop, value);
  }
  onChange = (value: any) => {
    this.setValue(value);
    this.validateIfNeeded("onChange");
  };
  onMount = () => {
    this.mounted = true;
    this.form.addField(this);
  };
  onUnmount = () => {
    this.mounted = false;
    // 移除关联
    this.form.removeField(this);
    this.resetState();
  };
  getRules = () => {
    const { rules } = this.props;
    if (this.props.required) {
      return {
        [this.prop]: rules
          ? rules.concat({ required: true })
          : { required: true },
      };
    }
    if (this.props.rules) {
      return { [this.prop]: this.props.rules };
    }
    if (this.form.rules) {
      return this.form.rules[this.prop];
    }
  };
  updateProps(props: FormItemProps) {
    this.props = { ...props };
  }
  validate = () => {
    return new Promise((resolve, reject) => {
      const descriptor = this.getRules();
      if (descriptor) {
        const validatorSchema = new ValidatorSchema(descriptor);
        const model = { [this.prop]: this.value };
        validatorSchema.validate(model, (errors) => {
          if (errors) {
            this.validatorMessage = errors[0].message;
            this.validatorState = "error";
            reject(this.validatorMessage);
          } else {
            this.validatorMessage = "";
            this.validatorState = "success";
            resolve(true);
          }
        });
      }
    });
  };
}
