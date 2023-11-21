import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import useCountDown from "@/hooks/useCountDown";

export default function Index() {
  const { current, start, pause } = useCountDown({
    time: 60 * 2000,
  });
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
    {
      label: "日历",
      url: "/pages/calendar/index",
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
        >
          {item.label}
        </View>
      ))}
      <View className='time'>
        {!!current.seconds ? current.seconds : 60}
        <Button onClick={start}>开始</Button>
        <Button onClick={pause}>暂停</Button>
      </View>
    </View>
  );
}
