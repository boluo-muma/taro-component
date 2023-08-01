import { useState } from "react";
import Cascader from "@/components/cascader";
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
  const [value, setValue] = useState([]);

  return (
    <View>
      <view onClick={() => setVisible(true)}>点我</view>
      <Cascader visible={visible} value={value} options={options}></Cascader>
    </View>
  );
}
