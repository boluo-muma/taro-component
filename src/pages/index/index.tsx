import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

export default function Index() {
  const list = [
    {
      label: "form表单",
      url: "/pages/form/index",
    },
    {
      label: "表格",
      url: "/pages/table/index",
    },
    {
      label: "级联",
      url: "/pages/cascader/index",
    },
  ];
  return (
    <View className='container'>
      {list.map((item) => (
        <View
          key={item.url}
          onClick={() =>
            Taro.navigateTo({
              url: item.url,
            })
          }
        >{item.label}</View>
      ))}
    </View>
  );
}
