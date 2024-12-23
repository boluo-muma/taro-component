import React, {
  useImperativeHandle,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { View, ScrollView } from "@tarojs/components";
import Popup from "@/components/popup";
import dayjs from "dayjs";
import useRefs from "@/hooks/useRefs";
import { raf } from "@/utils/index";
import CalendarMonth from "./CalendarMonth";
import { compareDay, getRect, compareMonth, getNode } from "./utils";
import { CalendarRef, CalendarProps } from "./type";
import "./index.scss";

const now = new Date();

const InternalCalendar: React.ForwardRefRenderFunction<
  CalendarRef,
  CalendarProps
> = (props, ref) => {
  const {
    value,
    onConfirm,
    onClose,
    minDate = now,
    maxDate = dayjs().add(6, "month").toDate(),
    type = "single",
    formatter,
    poppable,
    show = false,
    title = "日期选择",
  } = props;

  const [monthRefs, setMonthRefs] = useRefs();
  const bodyRef = useRef<Element>(null);
  const bodyHeightRef = useRef<number>(0);

  const [date, setDate] = useState(value);

  const [subTitle, setSubtitle] = useState("");

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (poppable && show) {
      init();
    }
  }, [show]);

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(date)) {
      setDate(value);
    }
  }, [value]);

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
      onConfirm?.(val);
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

  const handleClose = () => {
    setDate(value);
    onClose?.();
  };

  const init = () => {
    raf(() => {
      getRect(".calendar__body").then((res) => {
        bodyHeightRef.current = res.height || 0;
        scrollIntoView();
      });
    });
  };

  const scrollIntoView = () => {
    if (poppable && !show) return;
    if (date) {
      const targetDate = type === "single" ? date : date[0];
      if (!targetDate) return;
      scrollToDate(targetDate);
    } else {
      raf(handleScroll);
    }
  };

  const scrollToDate = async (targetDate: Date) => {
    raf(async () => {
      let height = 0;
      for (let i = 0; i < months.length; i++) {
        const month = months[i];
        if (compareMonth(month, targetDate) === 0) {
          if (bodyRef.current) {
            getNode(".calendar__body").then((node) => {
              node.scrollTo({ top: height });
            });
          }
          return;
        }
        height += await monthRefs[i].getHeight();
      }
    });
  };

  const handleScroll = async (e?) => {
    const top = e?.detail?.scrollTop || 0;
    const bottom = top + bodyHeightRef.current;
    const promisesHeight = months.map((_, index) =>
      monthRefs[index].getHeight()
    );

    const heights = await Promise.all(promisesHeight);

    const heightSum = heights.reduce((acc, cur) => acc + cur, 0);

    if (bottom > heightSum && top > 0) return;

    let height = 0;
    let currentMonth;
    const visibleRange = [-1, -1];

    for (let i = 0; i < months.length; i++) {
      const monthRef = monthRefs[i];
      const visible = height <= bottom && height + heights[i] > top;

      if (visible) {
        visibleRange[1] = i;

        if (!currentMonth) {
          currentMonth = monthRef;
          visibleRange[0] = i;
        }
      }

      height += heights[i];
    }
    if (currentMonth && currentMonth.getTitle() !== subTitle) {
      setSubtitle(currentMonth.getTitle());
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
            minDate={minDate}
            maxDate={maxDate}
            formatter={formatter}
            onselect={onselect}
          ></CalendarMonth>
        ))}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <View className='calendar__header'>
        <View className='calendar__header-title'>{title}</View>
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
    );
  };

  const renderBody = () => {
    return (
      <ScrollView
        className='calendar__body'
        ref={bodyRef}
        enhanced
        scrollY
        onScroll={handleScroll}
      >
        {renderMonth()}
      </ScrollView>
    );
  };

  const renderFooter = () => {
    return (
      <View className='calendar__footer'>
        <View
          className='calendar__footer-button'
          onClick={() => onConfirm?.(date)}
        >
          确认
        </View>
      </View>
    );
  };

  const renderInnerCalendar = () => {
    return (
      <View className='calendar'>
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </View>
    );
  };

  return poppable ? (
    <Popup visible={show} close={handleClose} style={{ height: "75%" }} round>
      {renderInnerCalendar()}
    </Popup>
  ) : (
    renderInnerCalendar()
  );
};

export default React.forwardRef(InternalCalendar);
