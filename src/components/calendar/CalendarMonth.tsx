import { forwardRef, useImperativeHandle, useMemo } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import dayjs from "dayjs";
import { CalendarMonthProps, CalendarDayType, CalendarDayItem } from "./type";
import "./index.scss";
import { compareDay, getRect } from "./utils";


function CalendarMonth(props: CalendarMonthProps, ref) {
  const {
    date,
    type,
    formatter,
    onselect,
    value,
    minDate,
    maxDate,
    formatTitle = "YYYY年MM月",
  } = props;


  const title = useMemo(() => {
    return dayjs(date).format(formatTitle);
  }, [date, formatTitle]);



  const customClass = useMemo(()=>{
    return `calendar__month-${date.getFullYear()}-${date.getMonth() + 1}`
  },[date])

  const getTitle = () => title;

  const handleSelect = (item: CalendarDayItem) => {
    if (item.type === "disabled") return;
    onselect(item.date);
  };

  // 获取这个个月多少天
  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  // 获取这个月的第1号的第1天为一周的第几天
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getDayType = (val: Date): CalendarDayType => {
    if (type === "single") {
      return compareDay(val, date) === 0 ? "selected" : "";
    }
    const [startDate, endDate] = Array.isArray(value) ? value : [];

    if (compareDay(val, minDate) < 0 || compareDay(val, maxDate) > 0)
      return "disabled";

    if (!startDate) {
      return "";
    }
    const compareToStart = compareDay(val, startDate);
    if (!endDate) {
      return compareToStart === 0 ? "start" : "";
    }
    const compareToEnd = compareDay(val, endDate);

    // 选择同一天
    if (!compareToStart && !compareToEnd) {
      return "start-end";
    }
    if (compareToStart === 0) return "start";
    if (compareToEnd === 0) return "end";
    if (compareToEnd == -1 && compareToStart === 1) return "middle";
    return "";
  };

  const getBottomInfo = (dayType: CalendarDayType) => {
    if (type === "range") {
      return dayType === "start"
        ? "开始"
        : dayType === "end"
        ? "结束"
        : dayType === "start-end"
        ? "开始/结束"
        : "";
    }
  };

  const renderDayBottomInfo = (curDate: CalendarDayItem) => {
    return <View className='calendar__bottom-info'>{curDate.bottomInfo}</View>;
  };

  const renderDays = () => {
    const days: any[] = [];
    const empty: any[] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysCount = daysOfMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    for (let i = 0; i < firstDay; i++) {
      empty.push(i);
    }

    for (let i = 1; i <= daysCount; i++) {
      const dayDate = new Date(year, month, i);
      const dayType = getDayType(dayDate);
      let config = {
        date: dayDate,
        type: dayType,
        text: i,
        bottomInfo: getBottomInfo(dayType),
      };
      if (formatter) {
        config = Object.assign({}, config, formatter(config));
      }
      days.push(config);
    }

    return (
      <>
        <View className='calendar__month-title'>{title}</View>
        <View className='calendar__days'>
          <View className='calendar__month-mark'>{date.getMonth() + 1}</View>
          {empty.map((i) => (
            <View className='calendar__empty' key={i}></View>
          ))}
          {days.map((day) => (
            <View
              key={day.date}
              onClick={() => handleSelect(day)}
              className={classNames(`calendar__day`, {
                [`calendar__day--${day.type}`]: !!day.type,
              })}
            >
              {day?.text}
              {renderDayBottomInfo(day)}
            </View>
          ))}
        </View>
      </>
    );
  };

  const getHeight = async () => {
    const res = await getRect(`.${customClass}`);
    return res.height;
  };

  useImperativeHandle(ref, () => ({
    getHeight,
    getTitle,
  }));

  return (
    <View
      className={classNames(
        "calendar__month",
        customClass
      )}
    >
      {renderDays()}
    </View>
  );
}

export default forwardRef(CalendarMonth);
