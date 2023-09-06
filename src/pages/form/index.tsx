import { useRef, useState } from "react";
import { Input, Button } from "@tarojs/components";
import { WKForm, FormItem } from "@/components/wk-form";
import { WKPickerSelector } from "@wakeapp/components";
import { FormModel } from "@/components/wk-form/model/FormModel";

export default function FormText() {
  const formRef = useRef<FormModel>(null);
  const [form, setForm] = useState<Record<string,any>>({});
  const submit = (val: any) => {
    console.log("fdsf", val);
  };

  const handleChange = (prop, val) => {
    console.log(prop, val, form);
    setForm((pre) => ({
      ...pre,
      [prop]: val,
    }));
  };

  console.log("form", form);

  return (
    <>
      <WKForm
        ref={formRef}
        value={form}
        onSubmit={submit}
        onChange={handleChange}
      >
        <FormItem label='姓名' prop='name' onChangePropsName='onInput' required>
          <Input placeholder='请输入'></Input>
        </FormItem>
        <FormItem label='城市' prop='cityCode' required={form.name}>
          <WKPickerSelector
            options={[{ label: "中国", value: 1 }]}
          ></WKPickerSelector>
        </FormItem>
      </WKForm>
      <Button onClick={() => formRef.current?.validate()}>提交</Button>
    </>
  );
}
