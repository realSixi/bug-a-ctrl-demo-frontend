import "./style.css";
import clsx from "clsx";
import { useKeyPress } from "../../hooks/useKeyDown.hook";
import { useEffect, useRef, useState } from "react";

interface KeyProps {
  value: string;
  disabled?: boolean;
  active?: boolean;

  axis?: string;
  factor?: number;

  onPress?: (data: any) => void;
}

const Key = ({
  value,
  disabled = true,
  active = false,
  factor = 1,
  axis,
  onPress,
}: KeyProps) => {
  const isPressed = useKeyPress(value);

  const start = useRef(0);
  const [ellapsed, setEllapsed] = useState(0);

  const sendEvent = async (time: number) => {
    if (time > 50 && axis) {
      if (onPress)
        onPress({
          [axis]: Math.min(time, 1000) * factor,
        });
    }
  };

  useEffect(() => {
    if (disabled) return;
    if (isPressed) {
      start.current = Date.now();
      let i = setInterval(() => {
        setEllapsed(Date.now() - start.current);
      }, 1);
      return () => clearInterval(i);
    } else if (!isPressed && start) {
      sendEvent(ellapsed).then(() => {
        setEllapsed(0);
        start.current = 0;
      });
    }
  }, [isPressed]);

  return (
    <div
      className={clsx(
        "key",
        disabled && "key--disabled",
        isPressed && !disabled && "key--active"
      )}
    >
      {value.toUpperCase()}
      {/*<span style={{fontSize: 12}}>{ellapsed}</span>*/}
      <span
        className={"progress"}
        style={{
          transform: `scale(${Math.min(ellapsed, 1000) / 1000}, 1)`,
        }}
      ></span>
    </div>
  );
};

export default Key;
