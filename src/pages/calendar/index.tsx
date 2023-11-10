import { useEffect, useRef } from "react";
import Calendar, { CalendarRef } from "@/components/calendar";
import { View } from "@tarojs/components";


function Test() {
  const calendarRef = useRef<CalendarRef>(null);


  return (
      <View style={{height: '100vh'}}>
        <Calendar ref={calendarRef} type='range'></Calendar>
      </View>
  );
}
export default Test;
