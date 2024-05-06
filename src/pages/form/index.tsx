import { useRef, useState } from "react";
import { Input, Button, Textarea } from "@tarojs/components";
import { WKForm, FormItem, LayoutType } from "@/components/wk-form";
import { WKPickerSelector } from "@wakeapp/components";
import { FormModel } from "@/components/wk-form/model/FormModel";

export default function FormText() {
  const formRef = useRef<FormModel>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [layout, setLayout] = useState<LayoutType>();

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

  return (
    <>
      <WKForm
        ref={formRef}
        value={form}
        onSubmit={submit}
        onChange={handleChange}
        layout={layout}
      >
        <FormItem label='姓名' prop='name' onChangePropsName='onInput' required>
          <Input placeholder='请输入'></Input>
        </FormItem>
        <FormItem label='城市' prop='cityCode' required={form.name}>
          <WKPickerSelector
            options={[{ label: "中国", value: 1 }]}
          ></WKPickerSelector>
        </FormItem>
        <FormItem label='备注' prop='remarks' required={form.name}>
          <Textarea placeholder='请输入'></Textarea>
        </FormItem>
      </WKForm>
      <Button onClick={() => formRef.current?.validate()}>提交</Button>
      <Button onClick={() => setLayout("vertical")}>vertical</Button>
      <Button onClick={() => setLayout("inline")}>inline</Button>
    </>
  );
}
