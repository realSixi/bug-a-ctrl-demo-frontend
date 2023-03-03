import { useEffect, useState } from "react";

// export const useKeyDown = (callback: () => void, keys: string[]) => {
//   const onKeyDown = (event: KeyboardEvent) => {
//     const wasAnyKeyPressed = keys.some((key) => event.key === key);
//     if (wasAnyKeyPressed) {
//       event.preventDefault();
//       callback();
//     }
//   };
//   useEffect(() => {
//     document.addEventListener("keydown", onKeyDown);
//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//     };
//   }, [onKeyDown]);
// };

export function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }: KeyboardEvent) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}
