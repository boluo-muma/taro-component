import { CSSProperties, FC, useState, useEffect, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { WKEmpty, View, Text, Block } from '@wakeapp/components';
import classNames from 'classnames';
import type { ColumnsItem } from './types';
import './index.scss';

interface Props {
  columns: ColumnsItem[];
  data: Array<Record<string, any>>;
  rowKey?: string;
  onChange?(params?: Record<string, any>): void;
}

interface ColumnListItem extends ColumnsItem {
  order?: string;
}

interface Sorter {
  order?: string | null;
  orderBy?: string | null;
}
const sortOrDerList = ['ascending', 'descending', ''];

const Table: FC<Props> = props => {
  const { data = [], columns = [], rowKey = 'id', onChange } = props;
  const [columnList, setColumnList] = useState<ColumnListItem[]>(columns);
  const [orderIndex, setOrderIndex] = useState<number>(-1);
  const [sorterObj, setSorterObj] = useState<Sorter>({});

  useEffect(() => {
    setColumnList(columns);
  }, [columns]);

  // 这里计算本地排序
  const list = useMemo(() => {
    const findColumn = ~orderIndex ? columnList[orderIndex] : null;
    // 自定义排序、没有排序、直接返回原数据
    if (findColumn?.sort === 'custom' || !findColumn?.order || !findColumn) return data;

    const { sortOrders = sortOrDerList } = findColumn;

    const copyData = JSON.parse(JSON.stringify(data));

    const orderMap = {
      [sortOrders[0]]: (a, b, orderBy) => a[orderBy] - b[orderBy],
      [sortOrders[1]]: (a, b, orderBy) => b[orderBy] - a[orderBy],
    };

    const { order, orderBy } = sorterObj;
    return order ? copyData.sort((a, b) => orderMap[order]?.(a, b, orderBy)) : copyData;
  }, [orderIndex, columnList, data, sorterObj]);

  const toggleOrder = ({ order, sortOrders }) => {
    sortOrders = sortOrders || sortOrDerList;
    if (order === '') return sortOrders[0];
    const index: number = sortOrders.indexOf(order || '');
    return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
  };

  const handleSort = (column, columnIndex) => {
    const setColumnOrder = val => {
      setColumnList(pre =>
        pre.map(item => {
          if (item.key !== column.key) {
            item.order = '';
          } else {
            item.order = val;
          }
          return { ...item };
        })
      );
    };
    let order = toggleOrder(column);
    const sorter = {
      order: order,
      orderBy: column.key,
    };
    setColumnOrder(order);
    setOrderIndex(columnIndex);
    setSorterObj(sorter);
    onChange?.(sorter);
  };

  const renderThead = () => {
    const calcThStyle = (column): CSSProperties => {
      return {
        width: column.width ? Taro.pxTransform(parseInt(column.width)) : '',
      };
    };
    const calcSort = column => {
      const { sortOrders = sortOrDerList, order } = column;
      const index = sortOrders.indexOf(order);
      return ~index ? sortOrDerList[index] : '';
    };
    return (
      <View className='wk-table-head'>
        <View className='wk-table-head__tr'>
          {columnList.map((column, columnIndex) => (
            <View
              className={classNames('wk-table-head__th', calcSort(column))}
              key={`${column.key}${columnIndex}`}
              style={calcThStyle(column)}
              onClick={() => handleSort(column, columnIndex)}
            >
              {!!column.renderHead && column.renderHead(column, columnIndex)}
              {!column.renderHead && <Text>{column.title}</Text>}
              {column.sort && (
                <View className='wk-table-head__sort'>
                  <View className='sort-ascending'></View>
                  <View className='sort-descending'></View>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };
  const renderTbody = () => {
    return (
      <View className='wk-table-body'>
        {list.map((row, rowIndex) => (
          <View className='wk-table-body__tr' key={row?.[rowKey]}>
            {columnList.map((column, columnIndex) => (
              <View className='wk-table-body__td' key={columnIndex}>
                {!!column.render && column.render(row, rowIndex)}
                {!column.render && <View>{row?.[column.key]}</View>}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
  return (
    <Block>
      <View className='wk-table'>
        {renderThead()}
        {renderTbody()}
      </View>
      {!list?.length && <WKEmpty desc='暂无数据'></WKEmpty>}
    </Block>
  );
};
Table.displayName = 'BTable'
export default Table;
