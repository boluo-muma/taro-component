import { FC, useState, useEffect } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";

type Props = {
  visible: Boolean;
  /**关闭按钮 */
  closeable?: Boolean;
  /** 点击蒙层关闭 */
  maskClosable?: Boolean;
  /** 是否圆角 */
  round?: Boolean;
  /** 弹出方向-默认是下方 */
  position?: string;
  /** 动画 */
  transition?: Boolean;
  mask?: Boolean;
  maskStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  close?: () => void;
  closed?: () => void;
};

const Popup: FC<Props> = (props) => {
  const [maskZIndex, setMaskZIndex] = useState(999);
  const [zIndex, setZIndex] = useState(999);

  const {
    visible,
    closeable = true,
    maskClosable = true,
    round,
    position = "bottom",
    transition = true,
    mask = true,
    maskStyle,
    style,
    close,
    closed,
    children,
  } = props;

  useEffect(() => {
    if (visible) {
      setZIndex((pre) => pre + 1);
      setMaskZIndex((pre) => pre + 1);
    }
  }, [visible]);

  const handleClickOverlay = () => {
    if (!maskClosable) return;
    close && close();
  };
  const handleTransitionEnd = () => {
    if (visible) return;
    closed && closed();
  };

  return (
    <View
      className={classNames("popup", {
        "popup-show": visible,
        "popup-transition": transition,
      })}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {mask && (
        <View
          className='popup-mask'
          style={{
            zIndex: maskZIndex,
            ...maskStyle,
          }}
          onClick={handleClickOverlay}
        ></View>
      )}

      <View
        className={classNames("popup-content custom-class", {
          "popup-round": round,
          [`popup-${position}`]: true,
        })}
        style={{
          zIndex: zIndex,
          ...style,
        }}
        onAnimationEnd={handleTransitionEnd}
      >
        {children}
        {closeable && (
          <View className='popup__close-icon' onClick={() => close?.()}>
            X
          </View>
        )}
      </View>
    </View>
  );
};
export default Popup;
