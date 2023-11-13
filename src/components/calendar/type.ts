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
  onConfirm?: (date: CalendarProps["value"]) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
  type?: "single" | "range";
  formatter?: (val: CalendarDayItem) => CalendarDayItem;
  poppable?: Boolean;
  show?: Boolean;
  /** 是否显示确认按钮*/
  showConfirm?: Boolean;
  title?: string
}

export interface CalendarRef {
  getDate: () => CalendarProps["value"];
  setDate: (date: CalendarProps["value"]) => void;
}

export interface CalendarMonthProps {
  value: CalendarProps["value"];
  date: Date;
  type: CalendarProps["type"];
  formatter: CalendarProps["formatter"];
  onselect: (val: CalendarProps["value"]) => void;
  minDate: Date
  maxDate: Date
}
