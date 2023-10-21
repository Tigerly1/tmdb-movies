import { useState, useEffect } from "react";

interface IUseWindowWidth {
  (): number; // The hook will return a number representing the window width
}

const useWindowWidth: IUseWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // initial value

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export default useWindowWidth;
