export interface EnumArrayMap {
  value: number | string;
  label: string;
  key?: string | number;
}

type MapValueOf<T extends readonly EnumArrayMap[]> = T[number]['value'];
type MapLabelOf<T extends readonly EnumArrayMap[]> = T[number]['label'];
type MapKeyOf<T extends readonly EnumArrayMap[]> = T[number]['key'];
interface MapItemOf<T extends readonly EnumArrayMap[]> {
  value: T[number]['value'];
  label: T[number]['label'];
  displayText?: string;
  key?: string | number;
}

export class EnumArray<T extends readonly EnumArrayMap[]> extends Array<EnumArrayMap> {
  constructor(list: T) {
    super(list.length);
    for (let i = 0; i < list.length; i++) {
      this[i] = list[i];
    }
    Object.setPrototypeOf(this, EnumArray.prototype);
  }

  getLabelByValue(value: MapValueOf<T>): MapLabelOf<T> {
    return this.find(item => item.value === value)?.label as MapLabelOf<T>;
  }

  getKeyByValue(value: MapValueOf<T>): MapKeyOf<T> {
    return this.find(item => item.value === value)?.key as MapKeyOf<T>;
  }

  getValueByLabel(label: MapLabelOf<T>): MapValueOf<T> {
    return this.find(item => item.label === label)?.value as MapValueOf<T>;
  }

  getValueByKey(key: MapKeyOf<T>): MapValueOf<T> {
    return this.find(item => item.key === key)?.value as MapValueOf<T>;
  }

  getItemByValue(value: MapValueOf<T>): MapItemOf<T> {
    return this.find(item => item.value === value) as MapItemOf<T>;
  }
}
export function createEnum<T extends readonly EnumArrayMap[]>(enums: T) {
  return Object.freeze(new EnumArray(enums));
}
