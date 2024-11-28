import { View, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import useCountDown from "@/hooks/useCountDown";

export default function Index() {
  const { current, start, pause } = useCountDown({
    time: 60 * 1000 * 60 * 24 * 365,
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
    {
      label: "popup",
      url: "/pages/popup/index",
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
        {!!current.days && `${current.days}天`}
        {!!current.hours && `${current.hours}时`}
        {!!current.minutes && `${current.minutes}分`}
        {!!current.total && `${current.seconds}秒`}
        <Button onClick={start}>开始</Button>
        <Button onClick={pause}>暂停</Button>
      </View>
    </View>
  );
}
