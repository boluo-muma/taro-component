import React, {
  useImperativeHandle,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { View, ScrollView } from "@tarojs/components";
import dayjs from "dayjs";
import useRefs from "@/hooks/useRefs";
import { raf } from "@/utils/index";
import CalendarMonth from "./CalendarMonth";
import { compareDay, getRect } from "./utils";
import "./index.scss";

interface CalendarProps {
  value?: Date | Array<Date>;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  type?: "single" | "range";
  formatter?: (val: CalendarDayItem) => CalendarDayItem;
}

type CalendarDayType =
  | ""
  | "start"
  | "start-end"
  | "middle"
  | "end"
  | "selected"
  | "disabled";

interface CalendarDayItem {
  date?: Date;
  type?: CalendarDayType;
  bottomInfo?: string;
  text?: number;
}

export interface CalendarRef {
  getDate: () => Date | Date[];
  setDate: (date: Date) => void;
}

const now = new Date();

const InternalCalendar: React.ForwardRefRenderFunction<
  CalendarRef,
  CalendarProps
> = (props, ref) => {
  const {
    value = new Date(),
    onChange,
    minDate = now,
    maxDate = dayjs().add(6, "month").toDate(),
    type = "single",
    formatter,
  } = props;

  const [monthRefs, setMonthRefs] = useRefs();
  const bodyRef = useRef<Element>(null);
  const bodyHeightRef = useRef<number>(0);
  const contentObserver = useRef<IntersectionObserver>(null);

  const [date, setDate] = useState(value);

  const [subTitle, setSubtitle] = useState("");

  useEffect(() => {
    init();
  }, []);

  const months = useMemo(() => {
    const monthList: Date[] = [];
    const diffCount = dayjs(maxDate).diff(minDate, "month");
    for (let i = 0; i <= diffCount; i++) {
      monthList.push(dayjs(minDate).add(i, "month").toDate());
    }
    return monthList;
  }, [minDate, maxDate]);

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(val: Date) {
        setDate(val);
      },
    };
  });

  const onselect = (val) => {
    if (type === "single") {
      setDate(val);
    } else if (type === "range") {
      const [startDay, endDay] = Array.isArray(date) ? date : [];

      if (startDay && !endDay) {
        // 拿选中时间跟开始时间对比（小于：-1，相等：0，大于：1）
        const compareToStart = compareDay(val, startDay);
        if (compareToStart === 1) {
          setDate([startDay, val]);
        } else if (compareToStart === -1) {
          setDate([val]);
        } else {
          setDate([val, val]);
        }
      } else {
        setDate([val]);
      }
    }
  };

  const init = () => {
    raf(() => {
      getRect(".calendar__body").then((res) => {
        bodyHeightRef.current = res.height || 0;
        handleScroll();
      });
    });
  };
  const handleScroll = async (e?) => {
    const top = e?.detail?.scrollTop || 0;
    const bottom = top + bodyHeightRef.current;
    const promisesHeight = months.map(async (_, index) =>
      monthRefs[index].getHeight()
    );
    const heights = await Promise.all(promisesHeight);

    const heightSum = heights.reduce((acc, cur) => acc + cur, 0);

    if (bottom > heightSum && top > 0) return;

    let height = 0;
    let currentMonth;
    const visibleRange = [-1, -1];

    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const visible = height <= bottom && height + heights[i] >= top;

      if (visible) {
        visibleRange[1] = i;

        if (!currentMonth) {
          currentMonth = month;
          visibleRange[0] = i;
        }
      }

      height += heights[i];
    }
    if (currentMonth && dayjs(currentMonth).format("YYYY-MM-DD") !== subTitle) {
      setSubtitle(dayjs(currentMonth).format("YYYY-MM"));
    }
  };

  const renderMonth = () => {
    return (
      <>
        {months.map((item, index) => (
          <CalendarMonth
            date={item}
            ref={setMonthRefs(index)}
            value={date}
            key={index}
            type={type}
            formatter={formatter}
            onselect={onselect}
          ></CalendarMonth>
        ))}
      </>
    );
  };

  return (
    <View className='calendar'>
      <View className='calendar__header'>
        <View className='calendar__header-subtitle'>{subTitle}</View>
        <View className='calendar__weekdays'>
          <View className='calendar__weekday'>日</View>
          <View className='calendar__weekday'>一</View>
          <View className='calendar__weekday'>二</View>
          <View className='calendar__weekday'>三</View>
          <View className='calendar__weekday'>四</View>
          <View className='calendar__weekday'>五</View>
          <View className='calendar__weekday'>六</View>
        </View>
      </View>
      <ScrollView
        className='calendar__body'
        ref={bodyRef}
        scrollY
        onScroll={handleScroll}
      >
        {renderMonth()}
      </ScrollView>
    </View>
  );
};

export default React.forwardRef(InternalCalendar);
