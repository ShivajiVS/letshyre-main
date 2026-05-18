import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        // retry if element not loaded yet
        setTimeout(scroll, 100);
      }
    };

    scroll();
  }, [hash]);

  return null;
}
