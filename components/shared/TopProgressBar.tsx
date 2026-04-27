"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    setWidth(0);
    setVisible(true);

    let w = 0;
    const tick = () => {
      w = w < 80 ? w + Math.random() * 18 : w + 2;
      const capped = Math.min(w, 92);
      setWidth(capped);
      if (capped < 92) {
        timerRef.current = setTimeout(tick, 90);
      }
    };
    tick();

    const finish = setTimeout(() => {
      setWidth(100);
      setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
    }, 380);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(finish);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_8px_0px] shadow-primary/80 transition-all"
        style={{
          width: `${width}%`,
          transitionDuration: width === 100 ? "200ms" : "120ms",
          transitionTimingFunction: "ease-out",
        }}
      />
    </div>
  );
}
