import { useState, useRef, useMemo } from "react";
import Calendar from "@/components/calendar";
import { CalendarRef } from "@/components/calendar/type";
import { View } from "@tarojs/components";
import dayjs from "dayjs";

function Test() {
  const calendarRef = useRef<CalendarRef>(null);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState([dayjs().add(2,'month').toDate(),dayjs().add(3,'month').toDate()]);

  const formatVal = useMemo(() => {
    if (!value?.length) return "";
    const [startDate, endDate] = value || [];
    return `${dayjs(startDate).format("YYYY/MM/DD")}-${dayjs(endDate).format(
      "YYYY/MM/DD"
    )}`;
  }, [value]);

  const onConfirm = (val) => {
    setValue(val);
    setVisible((pre) => !pre);
  };

  const onClose = ()=>{
    setVisible(false)
  }

  return (
    <View>
      <view onClick={() => setVisible(true)}>
        {formatVal ? formatVal : "点我"}
      </view>
      <Calendar
        ref={calendarRef}
        type='range'
        value={value}
        poppable
        show={visible}
        onConfirm={onConfirm}
        onClose={onClose}
      ></Calendar>
    </View>
  );
}
export default Test;
