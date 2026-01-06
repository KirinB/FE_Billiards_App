// Hooks/useScrollDirection.ts
import { useState, useEffect } from "react";

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlFooter = () => {
      const currentScrollY = window.scrollY;

      // Nếu cuộn xuống hơn 10px thì ẩn, cuộn lên thì hiện
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlFooter);
    return () => window.removeEventListener("scroll", controlFooter);
  }, [lastScrollY]);

  return isVisible;
};
