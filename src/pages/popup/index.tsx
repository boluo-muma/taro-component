import { useState } from "react";
import { View, Button } from "@tarojs/components";
import Popup from "@/components/popup";

export default function PopupDemo() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("center");
  return (
    <View>
      <Button
        onClick={() => {
          setVisible(true);
          setPosition("center");
        }}
      >
        中间
      </Button>
      <Button
        onClick={() => {
          setVisible(true);
          setPosition("bottom");
        }}
      >
        底部
      </Button>
      <Popup
        visible={visible}
        position={position}
        close={() => setVisible(false)}
      ></Popup>
    </View>
  );
}
