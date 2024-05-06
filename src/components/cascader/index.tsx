import { FC, useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import classNames from "classnames";
// import { AtIcon } from "taro-ui";
import Popup from "../popup";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import { getIndexByValue, treeFindPath, treeToList, treeFind } from "./common";

import "./index.scss";

export interface Option {
  text: string;
  value: number | string;
  disabled?: boolean;
  children?: Option[];
}

interface TabsNode extends Option {
  level?: number;
}

interface Tabs {
  nodes: TabsNode[];
  selectedNode: Option | null;
  paneKey: string | number;
}

interface Props {
  value?: Array<Option>;
  options: Option[];
  multiple?: boolean;
  visible: boolean;
  title?: string;
  onChange?: (val: Option[]) => void;
  onClose?: () => void;
}

const Cascader: FC<Props> = (props) => {
  const {
    options = [],
    visible,
    title,
    value = [],
    onChange,
    onClose,
    multiple,
  } = props;
  const [tabs, setTabs] = useState<Tabs[]>([]);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(value);
  const [target, setTarget] = useState("");

  const listOptions = useMemo(() => {
    return treeToList(options);
  }, [options]);

  useDeepCompareEffect(() => {
    if (listOptions.length) asyncValue();
  }, [listOptions]);

  useDeepCompareEffect(() => {
    if (value !== selected) setSelected(value);
    if (value && visible) asyncValue();
  }, [value, visible]);

  useDeepCompareEffect(() => {
    initData();
  }, [options]);

  useDeepCompareEffect(() => {
    if (value && !!value.length) {
      const index = getIndexByValue(options, active);
      const val = value[index];
      if (val !== undefined) {
        setTimeout(() => {
          setTarget(`cascader-tab-item${val.value}`);
        }, 400);
      } else {
        setTarget("");
      }
    }
  }, [active, value]);

  // 设置默认值
  const asyncValue = async () => {
    // 找出对应层级
    const mapOptions = value.reduce((acc: TabsNode[], cur) => {
      const find = listOptions.find((item) => item.value === cur.value);
      acc.push(find);
      return acc;
    }, []);
    let selectVal: TabsNode | Record<string, any> = {};
    // 找出最深层级
    if (mapOptions.length) {
      for (let i = mapOptions.length - 1; i >= 0; i--) {
        const item = mapOptions[i];
        if (!i) selectVal = item;
        if ((item.level || 0) > selectVal.level) selectVal = item;
      }
      // 找出树层级路径
      const pathNodes = treeFindPath(
        options,
        (item) => item.value === selectVal.value
      );
      const copyTbs = [...tabs];
      pathNodes.forEach((item) => {
        if (item.children && !!item.children.length) {
          copyTbs[item.level - 1].selectedNode = item;
          copyTbs[item.level] = {
            nodes: item.children || [],
            selectedNode: null,
            paneKey: item.level,
          };
        }
      });
      setTabs(copyTbs);
      setActive(selectVal.level - 1);
    }
  };

  const initData = () => {
    const panes = [
      {
        nodes: options,
        selectedNode: null,
        paneKey: 0,
      },
    ];
    setTabs(panes);
  };

  const handleClickItem = (node, item) => {
    if (node.disabled || !node.children) return;
    const copyTbs = [...tabs].slice(0, item.paneKey + 1);
    copyTbs[item.paneKey].selectedNode = node;
    copyTbs[item.paneKey + 1] = {
      nodes: node.children || [],
      selectedNode: null,
      paneKey: item.paneKey + 1,
    };
    setTabs(copyTbs);
    setActive(item.paneKey + 1);
  };

  const handleTabClick = (item, index) => {
    setActive(index);
  };

  const isChecked = (val, selectedValue: Array<Option>) => {
    if (Array.isArray(selectedValue)) {
      return !!selectedValue.find((item) => item.value === val);
    }
    return val === selectedValue;
  };
  const isIndeterminate = (node, __value: Array<Option>) => {
    const __selected = __value && __value.some((item) => item.value === node.value);
    return (
      !__selected &&
      !!treeFind(node.children, (item) =>
        __value.some((it) => it.value === item.value)
      )
    );
  };

  const handleChecked = (node: TabsNode) => {
    let list = selected ? [...selected] : [];
    const findIndex = list.findIndex((item) => item.value === node.value);
    if (multiple) {
      ~findIndex ? list.splice(findIndex, 1) : list.push(node);
    } else {
      ~findIndex ? list.splice(findIndex, 1) : (list = [node]);
    }
    setSelected(list);
  };

  const handleConfirm = () => {
    const val = selected.map((item) => ({
      text: item.text,
      value: item.value,
    }));
    onChange && onChange(val);
    onClose && onClose();
  };

  const handleClose = () => {
    if (value !== selected) {
      onChange && onChange(value);
      setSelected(value);
    }
    onClose && onClose();
  };

  console.log("selected", selected);

  return (
    <Popup
      visible={visible}
      round
      style={{ height: Taro.pxTransform(800) }}
      close={handleClose}
    >
      <View className='cascader__header'>
        <View onClick={handleClose}>取消</View>
        <View>{title}</View>
        <View className='cascader-confirm' onClick={handleConfirm}>
          确认
        </View>
      </View>
      <View className='tabs'>
        <ScrollView className='tabs__scroll' scrollX>
          <View className='tabs__wrap'>
            {tabs.map((item, index) => (
              <View
                key={item.paneKey}
                onClick={() => handleTabClick(item, index)}
                className={classNames("tabs__pane", {
                  "tabs__pane--active": item.paneKey === active,
                })}
              >
                {item.selectedNode ? item.selectedNode.text : "请选择"}
              </View>
            ))}
          </View>
        </ScrollView>
        <View
          className='tabs__content'
          style={{
            transform: `translate3d(${-100 * active}%, 0px, 0px)`,
            transition: "0.3s",
            transitionDuration: "0.3s",
          }}
        >
          {tabs.map((item) => (
            <ScrollView
              className='cascader-tab'
              scrollY
              key={item.paneKey}
              scrollIntoView={target}
            >
              {item.nodes.map((node, nodeIndex) => (
                <View
                  className='cascader-tab-item'
                  id={`cascader-tab-item${node.value}`}
                  key={node.value}
                  onClick={() => handleClickItem(node, item)}
                >
                  <View className='cascader-tab-item__title'>
                    <View
                      className={classNames("cascader-checkbox", {
                        "cascader-checkbox--checked": isChecked(
                          node.value,
                          selected
                        ),
                        "cascader-checkbox--indeterminate": isIndeterminate(
                          node,
                          selected
                        ),
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChecked(node);
                      }}
                    ></View>
                    {node.text}
                  </View>
                  {node.children && !!node.children.length && (
                    <View className='expand'></View>
                  )}
                </View>
              ))}
            </ScrollView>
          ))}
        </View>
      </View>
    </Popup>
  );
};
export default Cascader;
