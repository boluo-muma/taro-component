export type CalendarDayType =
  | ""
  | "start"
  | "start-end"
  | "middle"
  | "end"
  | "selected"
  | "disabled";

export interface CalendarDayItem {
  date?: Date;
  type?: CalendarDayType;
  bottomInfo?: string;
  text?: number;
}

export interface CalendarProps {
  value?: Date | Array<Date>;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  type?: "single" | "range";
  formatter?: (val: CalendarDayItem) => CalendarDayItem;
}

export interface CalendarMonthProps {
  value: CalendarProps['value']
  date: Date;
  type: CalendarProps["type"];
  formatter: CalendarProps["formatter"];
  onselect: (val: Date) => void;
}
