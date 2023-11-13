import { FC, useState, useEffect } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";

type Props = {
  visible: Boolean;
  closeable?: Boolean;
  maskClosable?: Boolean;
  round?: Boolean;
  position?: string;
  transition?: Boolean;
  mask?: Boolean;
  maskStyle?: React.CSSProperties;
  customStyle?: React.CSSProperties;
  children?: React.ReactNode;
  close?: () => void;
  closed?: () => void;
};

const Popup: FC<Props> = (props) => {
  const [maskZIndex, setMaskZIndex] = useState(999);
  const [zIndex, setZIndex] = useState(999);

  const {
    visible,
    closeable,
    maskClosable = true,
    round,
    position = "bottom",
    transition = true,
    mask = true,
    maskStyle,
    customStyle,
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
          ...customStyle,
        }}
        onAnimationEnd={handleTransitionEnd}
      >
        {children}
      </View>
    </View>
  );
};
export default Popup;
