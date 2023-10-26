import { useState, useMemo } from "react";
import Cascader, { Option } from "@/components/cascader";
import { View } from "@tarojs/components";

const options = [
  {
    text: "不要了",
    value: 1,
    children: [
      {
        text: "不要了1",
        value: "1-1",
      },
    ],
  },
];

export default function CascaderPage() {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<Option[]>();

  const onChange = (val) => {
    setVisible(false);
    setValue(val);
  };

  const formatVal = useMemo(() => {
    return value?.map((item) => item.text).join();
  }, [value]);

  return (
    <View>
      <view onClick={() => setVisible(true)}>
        {formatVal ? formatVal : "点我"}
      </view>
      <Cascader
        visible={visible}
        value={value}
        options={options}
        onChange={onChange}
      ></Cascader>
    </View>
  );
}
